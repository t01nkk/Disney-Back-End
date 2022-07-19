const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('character', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
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
    }, {
        timestamps: false
    });
};

// ○ Películas o series asociadas.