/*
User Model
*/

module.exports = function(sequelize, DataTypes) {
    
    return sequelize.define("user", {
        // Attributes
        id: {
          type: DataTypes.STRING(9),
          allowNull: false,
          primaryKey: true,
          unique: true,
          comment: "A-Number / student number."
        },
        pin: {
            type: DataTypes.STRING(256),
            comment: "Encrypted"
        },
        first_name: {
            type: DataTypes.STRING(60),
            comment: ""
        },
        middle_name: {
            type: DataTypes.STRING(60),
            comment: ""
        },
        last_name: {
            type: DataTypes.STRING(60),
            comment: ""
        },
        street_line1: {
            type: DataTypes.STRING(75),
            comment: ""
        },
        street_line2: {
            type: DataTypes.STRING(75),
            comment: ""
        },
        street_line3: {
            type: DataTypes.STRING(75),
            comment: ""
        },
        street_line4: {
            type: DataTypes.STRING(75),
            comment: ""
        },
        city: {
            type: DataTypes.STRING(50),
            comment: ""
        },
        stat_code: {
            type: DataTypes.STRING(3),
            comment: "This is a coded field (state/province)."
        },
        zip: {
            type: DataTypes.STRING(30),
            comment: "(zip, postal)"
        },
        natn_code: {
            type: DataTypes.STRING(5),
            comment: "This is a coded field (nation). The code descriptions are held in another table and would be varchar2(30)"
        },
        cnty_code: {
            type: DataTypes.STRING(5),
            comment: "County code. The code description is in another table and would be varchar2(30)."
        },
        phone_area: {
            type: DataTypes.STRING(6),
            comment: ""
        },
        phone_number: {
            type: DataTypes.STRING(12),
            comment: ""
        },
        phone_ext: {
            type: DataTypes.STRING(10),
            comment: ""
        },
        intl_access: {
            type: DataTypes.STRING(16),
            comment: "International access code"
        },
        tele_coe: {
            type: DataTypes.STRING(4),
            comment: "Coded field, with descriptions held in another table (CELL, etc), which are type varchar2(30)."
        }
    }, {
        // Options
        tableName: "users",
        timestamps: false,
        underscored: true
    });

};