/*
Course Model
*/

module.exports = function(sequelize, DataTypes) {
    
    return sequelize.define("course", {
        // Attributes
        crn: {
            type: DataTypes.STRING(5),
            comment: ""
        },
        Subj_code: { 
            type: DataTypes.STRING(4),
            comment: ""
        },
        Crse_numb: {
            type: DataTypes.STRING(5),
            comment: ""
        },
        Seq_numb: {
            type: DataTypes.STRING(3),
            comment: "Course Section."
        },
        Crse_title: {
            type: DataTypes.STRING(30),
            comment: ""
        },
        Levl_code: {
            type: DataTypes.STRING(2),
            comment: "Level code of course (undergrad (UG), graduate (GR), etc)."
        },
        Text_narrative: {
            type: DataTypes.STRING(30),
            comment: ""
        },
        Term_code: {
            type: DataTypes.STRING(6),
            comment: ""
        },
        Bldg_code: {
            type: DataTypes.STRING(6),
            comment: ""
        },
        Room_code: {
            type: DataTypes.STRING(10),
            comment: ""
        },
        Start_date: {
            type: DataTypes.DATE,
            comment: ""
        },
        End_date: {
            type: DataTypes.DATE,
            comment: ""
        },
        Begin_time: {
            type: DataTypes.STRING(4),
            comment: ""
        },
        End_time: {
            type: DataTypes.STRING(4),
            comment: ""
        },
        // Days
        Sun_day: {
            type: DataTypes.STRING(1),
            comment: ""
        },
        Mon_day: {
            type: DataTypes.STRING(1),
            comment: ""
        },
        Tue_day: {
            type: DataTypes.STRING(1),
            comment: ""
        },
        Wed_day: {
            type: DataTypes.STRING(1),
            comment: ""
        },
        Thu_day: {
            type: DataTypes.STRING(1),
            comment: ""
        },
        Fri_day: {
            type: DataTypes.STRING(1),
            comment: ""
        },
        Sat_day: {
            type: DataTypes.STRING(1),
            comment: ""
        }

    }, {
        // Options
        tableName: "courses",
        timestamps: false,
        underscored: true
    });

};