export function Poll(sequelize, DataTypes) {
    const poll = sequelize.define('Poll', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        poll_name: {
            type: DataTypes.TEXT
        },
        open_date: {
            type: DataTypes.DATE,
            allowNull: false,
            default: DataTypes.NOW
        },
        close_date: {
            type: DataTypes.DATE,
            allowNull: false
        }

    });
    return poll;
};