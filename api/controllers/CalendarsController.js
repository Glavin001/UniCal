/**
 * CalendarsController
 *
 * @description :: Server-side logic for managing Calendars
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    "count": function(req, res) {
        Calendars.count(function(err, result) {
            return res.json({
                "value": result
            });
        });
    },

    ":userid/:calendarid/calendar.ics": function(req, res) {
        var params = req.allParams();
        var userId = params.userid;
        var calendarId = params.calendarid;
        var ownerId = null;
        if (userId !== "0") {
            // 0 = anonymous
            // Not anonymous
            ownerId = userId;
        }
        var query = {
            where: {
                // "_id": Calendars.mongo.objectId(calendarId),
                id: calendarId,
                owner: ownerId
            }
        };
        sails.log.debug(query);
        Calendars.findOne(query, function(err, calendar) {
            sails.log.debug(err, calendar);
            if (err) {
                return res.serverError(err);
            }
            if (!calendar) {
                return res.notFound();
            }
            Calendars.toiCal(calendar, function(err, ical) {
                // sails.log.info(err, ical);
                return res.send(ical.toString());
            });
        });
    },

    "courses/calendar.ics": function(req, res) {
        var params = req.allParams();
        sails.log.debug(params);
        var query = {};
        if (params.where) {
            query.where = JSON.parse(params.where);
        }
        sails.log.debug(query);
        var Courses = sails.models.courses;
        Courses.find(query, function(err, courses) {
            if (err) {
                return res.serverError(err);
            }
            Courses.toiCal(courses, function(err, ical) {
                // sails.log.info(err, ical);
                return res.send(ical.toString());
            });
        });
    }

};
