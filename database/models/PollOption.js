import { DataTypes } from "sequelize";



export const PollOption = (sequelize) => {
    const model = sequelize.define('PollOption', {
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
    return model;
};
