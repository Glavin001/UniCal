/**
 * CalendarsController
 *
 * @description :: Server-side logic for managing Calendars
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


    ":calendarid/calendar.ics": function(res, req) {
        var params = req.allParams();
        var calendarId = params.calendarid;
        return res.json({
            'calendarId': calendarId
        });
    }

};
