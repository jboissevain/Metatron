
import { DataTypes } from "sequelize";

export const User = (sequelize) => {
    const model = sequelize.define('User', {
        display_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        braincells_lost: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0
        },
        last_message: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        activity_score: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0
        }
    });
    return model;
}

