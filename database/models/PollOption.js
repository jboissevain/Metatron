export function PollOption(sequelize, DataTypes) {

    const pollOption = sequelize.define('PollOption', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });
    return pollOption;
};