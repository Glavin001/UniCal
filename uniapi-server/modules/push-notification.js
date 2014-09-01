// Twilio Credentials
var config = require("../../../config");
//require the Twilio module and create a REST client 
var client = require('twilio')(config.twilio.sid, config.twilio.token);
var notificationCenter = {};
 
notificationCenter.send = function (o) {
    client.messages.create({
        to: o.to,
        from: config.twilio.number,
        body: o.message
    }, function (err, message) {
        console.log("Twilio SMS push error.sid: " + message.sid);
    });
}
notificationCenter.on = function (app,event,callback) {
	var io = require("socket.io").listen(app);
	io.sockets.on('connection', function(socket) {
		sockets.on(event,callback);
	});

}
module.exports = notificationCenter;