
export function UserVote(sequelize, DataTypes) {
    const userVote = sequelize.define('UserVote', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
    });

    return userVote;
};
