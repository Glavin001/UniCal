var icalendar = require("icalendar");

module.exports = function(app) {

    app.get('/calendar', function(req, res) {
        res.json({"error":"Requires Username."});
    });

    app.get('/calendar/:username/calendar.ics', function(req, res) {
        var calendar = getUsersCalendar(req.params.username);
        // Return
        res.header("Content-Type", "text/calendar; charset=utf-8");
        res.header("Content-Disposition", "inline; filename=calendar.ics");
        res.end(calendar.toString());
    });

    var getUsersCalendar = function(username) {
        // Generate iCalendar file
        var calendar = new icalendar.iCalendar();
        // Replace PRODID
        calendar.properties.PRODID = [];
        calendar.addProperty('PRODID',"-//Saint Mary's University//Calendar//EN");
        // Get User's Events
        var usersEvents = getUserEvents(username);
        // Add events to calendar
        for (var i=0, len=usersEvents.length; i<len; i++)
        {
            var vevent = jsonToEvent(usersEvents[i]);
            calendar.addComponent(vevent);
        }
        return calendar;
    };
    
    var getUserEvents = function(username) {
        // Sample Events
        // TODO: Fetch events from database given Username
        var usersEvents = [
            {
                "id": 0
                ,"summary": "Test Title"
                ,"description": "Test Description."
            }
        ];
        return usersEvents;
    };

    var jsonToEvent = function(json) {
        var vevent = new icalendar.VEvent("event-"+json.id);
        vevent.setSummary(json.summary);
        vevent.setDate(new Date(), 3600*(json.id+1));
        vevent.setDescription(json.description);
        vevent.addProperty('RRULE', {FREQ: 'WEEKLY', BYDAY: 'SU,TH,TU'});
        return vevent;
    };

};