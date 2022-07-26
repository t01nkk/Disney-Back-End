const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('film', {
        tittle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dateOfCreation: {
            type: DataTypes.DATEONLY
        },
        rating: {
            type: DataTypes.FLOAT
        },
        image: {
            type: DataTypes.STRING
        }
    });
};
