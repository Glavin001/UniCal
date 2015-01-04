/**
 * CalendarsController
 *
 * @description :: Server-side logic for managing Calendars
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

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
        sails.log.info(query);
        Calendars.findOne(query, function(err, calendar) {
            sails.log.info(err, calendar);
            if (err) {
                return res.serverError(err);
            }
            if (!calendar) {
                return res.notFound();
            }
            Calendars.toiCal(calendar, function(err, ical) {
                sails.log.info(err, ical);
                return res.send(ical.toString());
            });
        });
    },

    "count": function(req, res) {
        Calendars.count(function(err, result) {
            return res.json({
                "value": result
            });
        });

        // // Get Users
        // sails.models.users.native(function(err, collection) {
        //     if (err) {
        //         sails.log.error(err);
        //         return res.serverError(err.message);
        //     }
        //
        //     // Query User's calendars
        //     collection.aggregate([{
        //         "$unwind": "$calendars"
        //     }, {
        //         "$group": {
        //             _id: "count",
        //             "total": {
        //                 "$sum": 1
        //             }
        //         }
        //     }], function(err, result) {
        //         var count = result[0].total;
        //         return res.json({
        //             'value': count
        //         });
        //     });
        // });
    }

};
