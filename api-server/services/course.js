/**
Course Model Service
*/

var ormService = require('feathers-orm-service');
var path = require('path');

module.exports = function(sequelize) {
    
    var modelPath = path.resolve(__dirname, "../models/course");
    var service = new ormService(modelPath, sequelize);
    return service;

};