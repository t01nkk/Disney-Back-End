const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('movie', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.INTEGER
        },
        rating: {
            type: DataTypes.FLOAT
        },
        image: {
            type: DataTypes.STRING
        },
        isSeries: {
            type: DataTypes.BOOLEAN
        }
    });
};
// ○ Personajes asociados.
