import { Sequelize, DataTypes } from 'sequelize';
import { User } from './models/User.js';
import { Poll } from './models/Poll.js';
import { PollOption } from './models/PollOption.js';
import { UserVote } from './models/UserVote.js';
import * as dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize('metatron', 'postgres', process.env.PG_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres'
});

const MILLISECONDS_PER_MINUTE = 60000;
const MILLISECONDS_PER_DAY = MILLISECONDS_PER_MINUTE * 86400;
const models = {
    User: User(sequelize, DataTypes),
    Poll: Poll(sequelize, DataTypes),
    PollOption: PollOption(sequelize, DataTypes),
    UserVote: UserVote(sequelize, DataTypes)
}
//Set up associations between models
models.User.hasMany(sequelize.models.UserVote);
models.UserVote.belongsTo(sequelize.models.User);

models.PollOption.hasMany(sequelize.models.UserVote);
models.UserVote.belongsTo(sequelize.models.PollOption);

models.Poll.hasMany(sequelize.models.PollOption);
models.PollOption.belongsTo(sequelize.models.Poll);

const syncModels = async () => {
    await sequelize.sync({alter: true});
    sequelize.authenticate();
};

const importUser = async (displayName, userID) => {
    const user = await models.User.create({
        display_name: displayName,
        user_id: userID,
        user_score: 0
    });
};

const incrementActivity = async (userID) => {
    const user = await models.User.findAll({
        where: {
            user_id: userID
        }
    });

    let newScore = user[0].dataValues.activity_score + calculateActivityIncrement(user[0].dataValues.braincells_lost);

    await models.User.update({ activity_score: newScore }, {
        where: {
            user_id: userID
        }
    })
}

const incrementBraincells = async (userID, messageTime) => {
    const user = await models.User.findAll({
        where: {
            user_id: userID
        }
    })

    const lastPost = user[0].dataValues.last_message;
    const timeDifference = Math.abs(messageTime - lastPost);
    const newBraincells = user[0].dataValues.braincells_lost + 0.01;

    if (timeDifference > MILLISECONDS_PER_MINUTE) {
        await models.User.update({ braincells_lost: newBraincells, last_message: messageTime }, {
            where: {
                user_id: userID
            }
        });
    }

}

const getUser = async (userID) => {
    const user = await models.User.findAll({
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
    const user = await models.User.findAll({
        where: {
            user_id: userID
        }
    })

    const activity = user[0].dataValues.activity_score;
    const lastPost = user[0].dataValues.last_message;
    const timeSinceLastPost = Math.abs(Date.now() - lastPost);

    if (timeSinceLastPost > MILLISECONDS_PER_DAY) {
        const newScore = activity - activity * 0.05;
        await models.User.update({ activity_score: newScore }, {
            where: {
                user_id: userID
            }
        })
    } else {
        await incrementActivity(userID);
    }

}

export default {
    importUser,
    syncModels,
    incrementActivity,
    incrementBraincells,
    getUser,
    checkDecrement
}