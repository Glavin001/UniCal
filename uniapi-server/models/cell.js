/*
Cell Model
*/

module.exports = function(sequelize, DataTypes) {
    
    return sequelize.define("cell", {
        // Attributes
        id: {
          type: DataTypes.STRING(4),
          allowNull: false,
          primaryKey: true
        },
        description: {
            type: DataTypes.STRING(30),
            comment: "Description for telephone code."
        }
    }, {
        // Options
        tableName: "cells"
    });

};