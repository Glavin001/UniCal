/*
User GRades Model
*/

module.exports = function(sequelize, DataTypes) {
    
    return sequelize.define("UserGrade", {
        // Attributes
        crn: {
          type: DataTypes.STRING(5),
          allowNull: false,
          primaryKey: true,
          comment: "Course reference number (CRN) associated with the class section. It is primarily how we identify classes in Banner."
        },
        Grde_code: {
            type: DataTypes.STRING(6),
            comment: ""
        }
    }, {
        // Options
        tableName: "UserGrades"
    });

};