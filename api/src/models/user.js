const { DataTypes, UUID } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('user', {
        _id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING
        }
    });
};