/*
Course Model
*/

module.exports = {
    // Attributes
    crn: {
        type: String,
        required: true,
        unique: true,
        comment: ""
    },
    Subj_code: {
        type: String,
        required: true,
        comment: ""
    },
    Crse_numb: {
        type: String,
        required: true,
        comment: ""
    },
    Seq_numb: {
        type: String,
        required: true,
        comment: "Course Section."
    },
    Crse_title: {
        type: String,
        required: true,
        comment: ""
    },
    Levl_code: {
        type: String,
        comment: "Level code of course (undergrad (UG), graduate (GR), etc)."
    },
    Text_narrative: {
        type: String,
        comment: ""
    },
    Term_code: {
        type: String,
        comment: ""
    },
    Bldg_code: {
        type: String,
        comment: ""
    },
    Room_code: {
        type: String,
        comment: ""
    },
    Start_date: {
        type: Date,
        comment: ""
    },
    End_date: {
        type: Date,
        comment: ""
    },
    Begin_time: {
        type: String,
        comment: ""
    },
    End_time: {
        type: String,
        comment: ""
    },
    // Days
    Sun_day: {
        type: String,
        comment: ""
    },
    Mon_day: {
        type: String,
        comment: ""
    },
    Tue_day: {
        type: String,
        comment: ""
    },
    Wed_day: {
        type: String,
        comment: ""
    },
    Thu_day: {
        type: String,
        comment: ""
    },
    Fri_day: {
        type: String,
        comment: ""
    },
    Sat_day: {
        type: String,
        comment: ""
    }

};
