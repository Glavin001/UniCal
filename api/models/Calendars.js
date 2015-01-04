/**
 * Calendars.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var icalendar = require('icalendar');

module.exports = {

    attributes: {

        title: {
            type: 'string',
            defaultsTo: 'Untitled Calendar'
        },

        owner: {
            model: 'users'
        },

        courses: {
            // collection: 'courses',
            // via: 'crn'
            type: 'array'
        },

        isAnonymous: function() {
            return !this.owner;
        }

    },

    getCourses: function(calendar, callback) {
        var courseIds = calendar.courses;
        sails.log.debug(calendar, courseIds);
        sails.models.courses.find({
            where: {
                "crn": courseIds[0]
            }
        }, callback);
    },

    toiCal: function(calendar, callback) {
        var self = this;

        Calendars.getCourses(calendar, function(err, courses) {

            sails.log.debug(err, courses);
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

            return callback(err, calendar);

        });

    }

};
