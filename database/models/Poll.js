import { DataTypes } from "sequelize";



export const Poll = (sequelize) => {
    const model = sequelize.define('Poll', {
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
    return model;
}
