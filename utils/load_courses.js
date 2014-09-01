#!/usr/bin/env node

var pkg = require('../package.json');
var fs = require('fs');
var csv = require('csv');
var path = require('path');
var program = require('commander');
var Sequelize = require('sequelize');
var async = require('async');
var _ = require('lodash');

var conf = require('../api-server/default.config.json');

program
    .version(pkg.version)
    .option('-i, --input [csvFilePath]', 'Use this input CSV file.')
    .option('--database:dialect [dialect]', 'Dialect', conf.database.dialect)
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

var normalizeRow = function(row) {
    // term
    row.Term_code = row.term;
    delete row.term;
    
    // CRN
    row.crn = row.CRN;
    delete row.CRN;

    // subject
    row.Subj_code = row.subject;
    delete row.subject;

    // course
    var c = row.course.split('.');
    row.Crse_numb = c[0];
    row.Seq_numb = c[1];
    delete row.course;

    // title
    row.Crse_title = row.title;
    delete row.title;

    // cross listed


    // linked(labs)


    // start date
    row.Start_date = new Date(row['start date']);
    delete row['start date'];

    // end date
    row.End_date = new Date(row['end date']);
    delete row['end date'];
    
    // start time
    row.Begin_time = row['start time'];
    delete row['start time'];

    // end time
    row.End_time = row['end time'];
    delete row['end time'];

    // days
    var d = row.days.split('');
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
    row.Bldg_code = row.building;
    delete row.building;

    // room
    row.Room_code = row.room;
    delete row.room;

    // faculty


    // Return
    return row;
};

// Process CSV
csv()
.from.path(path.resolve(program.input), { delimiter: ',', escape: '"' })
.on('error', function(error){
  console.log(error.message);
})
.to.array(function(rows) {
    // Process Data
    var header = rows.shift();
    var data = [];

    // Create row Object with headers
    async.map(rows, function(row, callback) {
        //console.log(header, row);
        var r = _.zipObject(header, row);
        normalizeRow(r);
        return callback(null, r);
    }, function(err, data) {
        //console.log(err, results.length);
        
        //console.log(JSON.stringify(data, undefined, 4));

        var sequelize = new Sequelize(program['database:name'], program['database:username'], program['database:password'], {
            dialect: program['database:dialect'],
            port: program['database:port']
        });

        var Course = sequelize.import(path.resolve(__dirname, "../api-server/models/course"));

        sequelize.sync({ force: true })
        .success(function() {
            //
            console.log('All synced up.');

            Course.bulkCreate(data)
            .success(function(results) {
                console.log('Done creating Courses: ');
            })
            .error(function(error) {
                console.error(error);
            });

        });


    });

});
