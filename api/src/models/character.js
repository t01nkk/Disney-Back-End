const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('character', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER
        },
        weight: {
            type: DataTypes.FLOAT
        },
        story: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        }
    });
};

// ○ Películas o series asociadas.