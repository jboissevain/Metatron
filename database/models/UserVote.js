
import { DataTypes } from "sequelize";



export const UserVote = (sequelize) => {
    const model = sequelize.define('UserVote', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
    });
    return model;
}
