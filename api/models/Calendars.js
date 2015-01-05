/**
 * Calendars.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

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
        // sails.log.debug(calendar, courseIds);
        sails.models.courses.find({
            where: {
                "crn": courseIds
            }
        }, callback);
    },

    toiCal: function(calendar, callback) {
        var self = this;

        Calendars.getCourses(calendar, function(err, courses) {
            if (err) {
                return callback(err);
            }

            sails.models.courses.toiCal(courses, callback);
        });

    }

};
