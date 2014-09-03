#!/usr/bin/env node

var pkg = require('../package.json');
var fs = require('fs');
var csv = require('csv');
var path = require('path');
var program = require('commander');
var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');
var ProgressBar = require('progress');

var conf = require('../uniapi-server/default.config.json');

program
.version(pkg.version)
.option('-i, --input [jsonFilePath]', 'Use this input JSON file.')
.option('--database:host [host]', 'Database Host', conf.database.host)
.option('--database:name [name]', 'Database Name', conf.database.name)
.option('--database:port [port]', 'Port', conf.database.port)
.option('--database:username [username]', 'Username', conf.database.username)
.option('--database:password [password]', 'Password', conf.database.password)
.parse(process.argv);

if (!(program.input))
{
  console.error('Error: CLI requires input file paths.');
  process.exit();
  return;
}

var timeFromStr = function(str) {
  // Catch errors
  // It could be "TBA"
  try {
    // Ex: "4:00 pm"
    var hours = 0;
    var minutes = 0;
    var s = str.split(':');
    hours = parseInt(s[0]);
    minutes = parseInt(s[1]);
    // Check if 'pm'
    if (s[1].indexOf("pm") != -1 && hours!= 12) {
      hours += 12;
    }
    return {'hours':hours, 'minutes':minutes }
    // return (hours * 100)+minutes;
  } catch (e) {
    return null;
  }
};

var normalizeRow = function(row) {
    // term
    // row.term = row.term;

    // CRN
    // row.crn = row.crn;

    // subject
    row.Subj_code = row.subject;
    delete row.subject;

    // course
    row.Crse_numb = row.courseNumb;
    delete row.courseNumb;
    row.Seq_numb = row.seqNumb;
    delete row.seqNumb;

    // title
    row.Crse_title = row.title;
    delete row.title;

    // cross listed


    // linked(labs)


    // start date
    row.Start_date = new Date(row.startDate);
    delete row.startDate;

    // end date
    row.End_date = new Date(row.endDate);
    delete row.endDate;

    // start time
    row.Begin_time = timeFromStr(row.time.start);
    delete row.time.start;

    // end time
    row.End_time = timeFromStr(row.time.end);
    delete row.time.end;
    delete row.time;

    // days
    var d = row.days;
    if ( _.contains(d, 'M') ) { // Monday
      row.Mon_day = '1';
    }
    if ( _.contains(d, 'T') ) { // Tuesday
      row.Tue_day = '1';
    }
    if ( _.contains(d, 'W') ) { // Wednesday
      row.Wed_day = '1';
    }
    if ( _.contains(d, 'R') ) { // Thursday
      row.Thu_day = '1';
    }
    if ( _.contains(d, 'F') ) { // Friday
      row.Fri_day = '1';
    }
    if ( _.contains(d, 'S') ) { // Saturday
      row.Sat_day = '1';
    }
    if ( _.contains(d, 'U') ) { // Sunday
      row.Sun_day = '1';
    }
    delete row.days;

    // building
    var r = /(.*)\s?([0-9]*).*/;
    var loc = row.location;
    var ls = loc.match(r);
    row.Bldg_code = ls[1];
    delete row.location;
    // room
    row.Room_code = ls[2];

    // faculty
    row.faculty = row.instructors;
    delete row.instructors;

    // Return
    return row;
  };

// Process CSV

var inputPath = path.resolve(program.input);
var rows = require(inputPath);

// Process Data
var data = [];

// Create row Object with headers
async.map(rows, function(row, callback) {
    // Check if Cancelled
    if (row.title === "*CANCELLED*")
    {
      var e = new Error("Course has been cancelled");
      // console.log(e);
      return callback(null, null);
    }
    normalizeRow(row);
    return callback(null, row);
  }, function(err, results) {
    // console.log(err, results.length);

    // Setup connection to Database
    var options = {
      user: program['database:username'],
      pass: program['database:password']
    };
    mongoose.connect('mongodb://'+program['database:host']+":"+program['database:port']+"/"+program['database:name'], options);

    var Course = require(path.resolve(__dirname, "../uniapi-server/services/course"))(mongoose).model;

    var bar = new ProgressBar('Importing Course into MongoDB [:bar]', { 
      total: results.length
    });


    async.map(results, function(data, callback) {
      bar.tick(1);
      if (data) {
        Course.update({'crn':data.crn}, data, {upsert: true}, function(err) {
          if (err) {
            console.log("An error occured: ", err);
          }
          callback(err);
        });
      } else {
        callback(null);
      }
    },
    function(errors) {
      console.log('Completed.');
      mongoose.connection.close();
    }
    );

  });
