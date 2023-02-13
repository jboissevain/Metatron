const Sequelize = require('sequelize');
const sequelize = new Sequelize('metatron', 'postgres', process.env.PG_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres'
});

const MILLISECONDS_PER_MINUTE = 60000;
const MILLISECONDS_PER_DAY = MILLISECONDS_PER_MINUTE * 86400;

const User = sequelize.define('user', {
    display_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    braincells_lost: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    last_message: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    activity_score: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0
    }
});

const syncModels = async () => {
    User.sync();
    sequelize.authenticate();
}

const importUser = async (displayName, userID) => {
    const user = await User.create({
        display_name: displayName,
        user_id: userID,
        user_score: 0
    });
};

const incrementActivity = async (userID) => {
    const user = await User.findAll({
        where: {
            user_id: userID
        }
    })

    let newScore = user[0].dataValues.activity_score + calculateActivityIncrement(user[0].dataValues.braincells_lost);

    await User.update({ activity_score: newScore }, {
        where: {
            user_id: userID
        }
    })
}

const incrementBraincells = async (userID, messageTime) => {
    const user = await User.findAll({
        where: {
            user_id: userID
        }
    })

    const lastPost = user[0].dataValues.last_message;
    const timeDifference = Math.abs(messageTime - lastPost);
    const newBraincells = user[0].dataValues.braincells_lost + 0.01;

    if (timeDifference > MILLISECONDS_PER_MINUTE) {
        await User.update({ braincells_lost: newBraincells, last_message: messageTime}, {
            where: {
                user_id: userID
            }
        });
    }
    

}

const getUser = async (userID) => {
    const user = await User.findAll({
        where: {
            user_id: userID
        }
    })
    return user[0];
}

function calculateActivityIncrement(braincells) {
    return 1 + braincells;
}

const checkDecrement = async (userID) => {
    const user = await User.findAll({
        where: {
            user_id: userID
        }
    })

    const activity = user[0].dataValues.activity_score;
    const newScore = activity - activity*0.05;
    const lastPost = user[0].dataValues.last_message;
    const timeSinceLastPost = Math.abs(Date.now() - lastPost);

    if(timeSinceLastPost > MILLISECONDS_PER_DAY) {
        await User.update({ activity_score: newScore }, {
            where: {
                user_id: userID
            }
        })
    } else {
        await incrementActivity(userID);
    }

}

module.exports = {
    importUser,
    syncModels,
    incrementActivity,
    incrementBraincells,
    getUser,
    checkDecrement
}