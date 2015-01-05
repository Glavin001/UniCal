/**
 * Courses.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var icalendar = require('icalendar');

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
        },


        // Attribute methods
        toEvent: function() {
            var self = this;
            //console.log('jsonToEvent: ', json);
            var vevent = new icalendar.VEvent("event-" + self.crn);
            var summary = self.Subj_code + " " + self.Crse_numb + " - " +
                self.Crse_title;
            vevent.setSummary(summary);

            vevent.setDescription(self.Faculty);
            // Calculate date and event length
            var startDate = new Date(self.Start_date);
            var startTime = self.Begin_time;
            startDate.setHours(startTime.hours, startTime.minutes);

            var endTime = self.End_time;
            var endDate = new Date(self.Start_date);
            endDate.setHours(endTime.hours, endTime.minutes);
            // console.log(startDate, endDate);
            vevent.setDate(startDate, endDate);

            var days = [];
            if (self.Mon_day) {
                days.push("MO");
            }
            if (self.Tue_day) {
                days.push("TU");
            }
            if (self.Wed_day) {
                days.push("WE");
            }
            if (self.Thu_day) {
                days.push("TH");
            }
            if (self.Fri_day) {
                days.push("FR");
            }
            if (self.Sat_day) {
                days.push("SA");
            }
            if (self.Sun_day) {
                days.push("SU");
            }
            // console.log(days);
            vevent.addProperty('RRULE', {
                FREQ: 'WEEKLY',
                BYDAY: days.join(','),
                UNTIL: new Date(self.End_date)
            });
            var location = self.Bldg_code + " " + self.Room_code;
            vevent.addProperty('LOCATION', location);
            return vevent;
        }

    },

    toiCal: function(courses, callback) {

        // sails.log.debug(courses);
        // Generate iCalendar file
        var calendar = new icalendar.iCalendar();
        // Replace PRODID
        calendar.properties.PRODID = [];
        calendar.addProperty('PRODID',
            "-//Saint Mary's University//Calendar//EN"
        );
        // Add events to calendar
        for (var i = 0, len = courses.length; i <
            len; i++) {
            var course = courses[i];
            if (course.Begin_time && course.End_time) {
                var vevent = course.toEvent();
                calendar.addComponent(vevent);
            }
        }

        return callback(null, calendar);

    }

};
