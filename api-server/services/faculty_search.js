//
var facultySearch = require("../modules/faculty-search");
// Service


//fname == first name , lname == last name
module.exports = {
    find: function (params, callback) {
        facultySearch(params.query.fname, params.query.lname, function(err, data) {
            //console.log(err, data);
            return callback(err, data);
        });
    }
};