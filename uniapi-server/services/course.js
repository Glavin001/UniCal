/**
Course Model Service
*/

var mongooseService = require('feathers-mongoose');
var path = require('path');

module.exports = function(mongoose) {
    var modelPath = path.resolve(__dirname, "../models/course");
    var modelSchema = require(modelPath);
    // Create your Mongoose-Service, for a `Course`
    var service = mongooseService('course', modelSchema, mongoose);
    return service;
};
