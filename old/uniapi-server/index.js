// Dependencies
var nconf = require('nconf');
var feathers = require('feathers');
// Get Mongoose
var mongoose = require('mongoose');
// Cross-Origin Requests
var cors = require('cors');

// Configuration
//
// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'path/to/config.json'
//
nconf.argv()
   .env()
   .file('custom', __dirname+'/config.json')
   .file({ file: __dirname+'/default.config.json' });

if (nconf.get('help')) {
    console.log("HELP");
    process.exit();
    return;
}

// Setup connection to Database
var options = {
  user: nconf.get('database:username'),
  pass: nconf.get('database:password')
};
mongoose.connect('mongodb://'+nconf.get('database:host')+":"+nconf.get('database:port')+"/"+nconf.get('database:name'), options);

// Services
var facultySearchService = require('./services/faculty_search');
var coursesService = require('./services/course')(mongoose);

// CORS
var app = feathers();
if (nconf.get('server:cors')) {
  app.use(cors());
}

// Start server
app.configure(feathers.socketio())
    .use('/api/v1/faculty', facultySearchService)
    .use('/api/v1/courses', coursesService)
    .listen(nconf.get('server:port'), function() {
        console.log('Listening on port '+nconf.get('server:port')+'.');
    });
