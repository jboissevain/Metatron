import { Sequelize, DataTypes, Op } from 'sequelize';
import {Collection} from 'discord.js';
import * as dotenv from 'dotenv';
import { User } from './models/User.js';
import { Poll } from './models/Poll.js';
import { PollOption } from './models/PollOption.js';
import { UserVote } from './models/UserVote.js';
import { get } from 'http';

dotenv.config();


export const sequelize = new Sequelize('metatron', 'postgres', process.env.PG_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres'
});

const MILLISECONDS_PER_MINUTE = 60000;
const MILLISECONDS_PER_HOUR = MILLISECONDS_PER_MINUTE * 60;
const MILLISECONDS_PER_DAY = MILLISECONDS_PER_MINUTE * 3600;

const user = User(sequelize);
const poll = Poll(sequelize);
const pollOption = PollOption(sequelize);
const userVote = UserVote(sequelize);

//Set up associations between models
user.hasMany(sequelize.models.UserVote);
userVote.belongsTo(sequelize.models.User);

pollOption.hasMany(sequelize.models.UserVote);
userVote.belongsTo(sequelize.models.PollOption);

poll.hasMany(sequelize.models.PollOption);
pollOption.belongsTo(sequelize.models.Poll);

const syncModels = async () => {
    await sequelize.sync({ alter: true });
    sequelize.authenticate();
};

const importUser = async (displayName, userID) => {
    const user = await sequelize.models.User.create({
        display_name: displayName,
        user_id: userID,
        user_score: 0
    });
};

const incrementActivity = async (userID) => {
    const user = await sequelize.models.User.findAll({
        where: {
            user_id: userID
        }
    });
    
    let increase = calculateActivityIncrement(user[0].dataValues.braincells_lost);
    let newScore = user[0].dataValues.activity_score + increase;

    await sequelize.models.User.update({ activity_score: newScore }, {
        where: {
            user_id: userID
        }
    });

    return increase;
};

const incrementBraincells = async (userID, messageTime) => {
    const user = await sequelize.models.User.findAll({
        where: {
            user_id: userID
        }
    });

    const lastPost = user[0].dataValues.last_message;
    const timeDifference = Math.abs(messageTime - lastPost);
    const newBraincells = user[0].dataValues.braincells_lost + 0.01;

    if (timeDifference > MILLISECONDS_PER_MINUTE) {
        await sequelize.models.User.update({ braincells_lost: newBraincells, last_message: messageTime }, {
            where: {
                user_id: userID
            }
        });
    }

};

const getUser = async (userID) => {
    const user = await sequelize.models.User.findAll({
        where: {
            user_id: userID
        }
    });
    return user[0];
};

function calculateActivityIncrement(braincells) {
    return 1 + braincells;
};

const getUsers = async () => {
    const Users = await sequelize.models.User.findAll({
        order: [
            ['activity_score', 'DESC']
        ]
    })

    return Users;
};

const checkDecrement = async (userID) => {
    const user = await sequelize.models.User.findAll({
        where: {
            user_id: userID
        }
    });

    const activity = user[0].dataValues.activity_score;
    const lastPost = user[0].dataValues.last_message;
    const timeSinceLastPost = Math.abs(Date.now() - lastPost);
    let userGain = 0;

    if (timeSinceLastPost > MILLISECONDS_PER_DAY) {
        const newScore = activity * 0.95;
        await sequelize.models.User.update({ activity_score: newScore }, {
            where: {
                user_id: userID
            }
        })
        userGain = newScore - activity;
    } else {
        userGain = await incrementActivity(userID);
    }
    return userGain;
};

const createPoll = async (name, authorID, duration, options) => {

    //Create the Poll itself
    const close_date = new Date(new Date().getTime() + (duration * MILLISECONDS_PER_HOUR));

    await sequelize.models.Poll.create({
        poll_name: name,
        author: authorID,
        open_date: new Date(),
        close_date: close_date,
    });

    //Get the just created Poll
    const lastPoll = await sequelize.models.Poll.findAll({
        where: {
            poll_name: name
        },
        order: [
            ['createdAt', 'DESC']
        ]

    });

    const lastPollKey = lastPoll[0].dataValues.id;

    //Create Poll Options for each passed option, and associate them with the Poll.
    for (const option of options) {
        await sequelize.models.PollOption.create({
            description: option,
            PollId: lastPollKey
        });
    }
};

const getOpenPolls = async () => {
    const pollResults = await sequelize.models.Poll.findAll({
        where: {
            close_date: {
                [Op.gt]: new Date()
            }
        }
    });


    return pollResults;
};

const getPollOptions = async (pollId) => {
    const pollOptions = await sequelize.models.PollOption.findAll({
        where: {
            PollId: pollId
        }
    })

    return pollOptions;
}

const getUnvotedPolls = async (userId) => {

    const openPolls = await getOpenPolls();
    let pollIds = [];

    openPolls.forEach(poll => {
        pollIds.push(poll.dataValues.id);
    })
    
    //Open PollOptions to match UserVotes
    const pollOptions = await sequelize.models.PollOption.findAll({
        where:{
            PollId: pollIds
        }
    });

    let pollOptionIds = [];
    pollOptions.forEach(option => {
        pollOptionIds.push(option.dataValues.id);
    });

    //Already submitted votes on currently open polls
    const userVotes = await sequelize.models.UserVote.findAll({
        where: {
            PollOptionId: pollOptionIds,
            UserUserId: userId
        }
    });

    let votedOptionIds = [];
    userVotes.forEach(vote => {
        votedOptionIds.push(vote.dataValues.PollOptionId);
    });

    const unvotedOptions = pollOptions.filter(option => !votedOptionIds.includes(option.dataValues.id));


    let unvotedPollIds = new Set()
    for(const unvotedOption of unvotedOptions) {
        unvotedPollIds.add(unvotedOption.dataValues.PollId);
    }

    return openPolls.filter(openPoll => unvotedPollIds.has(openPoll.dataValues.id));
}

export default {
    importUser,
    syncModels,
    incrementActivity,
    incrementBraincells,
    getUser,
    checkDecrement,
    createPoll,
    getOpenPolls,
    getPollOptions,
    getUsers,
    getUnvotedPolls,

}