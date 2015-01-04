/**
 * Courses.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        // Attributes
        crn: {
            type: "string",
            required: true,
            unique: true,
            comment: ""
        },
        Subj_code: {
            type: "string",
            required: true,
            comment: ""
        },
        Crse_numb: {
            type: "string",
            required: true,
            comment: ""
        },
        Seq_numb: {
            type: "string",
            required: true,
            comment: "Course Section."
        },
        Crse_title: {
            type: "string",
            required: true,
            comment: ""
        },
        Levl_code: {
            type: "string",
            comment: "Level code of course (undergrad (UG), graduate (GR), etc)."
        },
        Faculty: {
            type: "string"
        },
        Text_narrative: {
            type: "string",
            comment: ""
        },
        Term_code: {
            type: "string",
            comment: ""
        },
        Bldg_code: {
            type: "string",
            comment: ""
        },
        Room_code: {
            type: "string",
            comment: ""
        },
        Start_date: {
            type: "date",
            comment: ""
        },
        End_date: {
            type: "date",
            comment: ""
        },
        Begin_time: {
            type: "json",
            comment: ""
        },
        End_time: {
            type: "json",
            comment: ""
        },
        // Days
        Sun_day: {
            type: "string",
            comment: ""
        },
        Mon_day: {
            type: "string",
            comment: ""
        },
        Tue_day: {
            type: "string",
            comment: ""
        },
        Wed_day: {
            type: "string",
            comment: ""
        },
        Thu_day: {
            type: "string",
            comment: ""
        },
        Fri_day: {
            type: "string",
            comment: ""
        },
        Sat_day: {
            type: "string",
            comment: ""
        }

    }
};
