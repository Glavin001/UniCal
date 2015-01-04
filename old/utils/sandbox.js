#!/usr/bin/env node

var pkg = require('../package.json');
var fs = require('fs');
var faker = require('faker');
var path = require('path');
var program = require('commander');
var Sequelize = require('sequelize');
var async = require('async');
var _ = require('lodash');

var conf = require('../server/default.config.json');

program
    .version(pkg.version)
    .option('-u, --users [count]', 'Create [count] number of new random Users.', 0)
    .option('--database:dialect [dialect]', 'Dialect', conf.database.dialect)
    .option('--database:name [name]', 'Database Name', conf.database.name)
    .option('--database:port [port]', 'Port', conf.database.port)
    .option('--database:username [username]', 'Username', conf.database.username)
    .option('--database:password [password]', 'Password', conf.database.password)
    .parse(process.argv);


var sequelize = new Sequelize(program['database:name'], program['database:username'], program['database:password'], {
    dialect: program['database:dialect'],
    port: program['database:port']
});

var Users = sequelize.import(path.resolve(__dirname, "../server/models/user"));

var genUser = function(i, callback) {
    
    // http://stackoverflow.com/a/2998822/2578205 
    function pad(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length-size);
    }
    
    var user = {
        id: "A"+pad(i, 8),
        pin: "password",
        first_name: faker.random.first_name(),
        middle_name: faker.random.first_name(),
        last_name: faker.random.last_name(),
        street_line1: faker.Address.streetAddress(),
        street_line2: faker.Address.secondaryAddress(),
        zip: faker.Address.zipCode(),
        city: faker.Address.city(),
        stat_code: faker.Address.usState(),
        cnty_code: faker.Address.ukCounty(),
        natn_code: faker.Address.ukCountry(),
        phone_number: faker.PhoneNumber.phoneNumber()
    };

    // Return
    return callback(null, user);
};

sequelize.sync()
.success(function() {
    //
    console.log('All synced up.');

    var data = [];
    var length = program.users; // user defined length
    for(var i = 0; i < length; i++) {
        data.push(i);
    }

    async.map(data, genUser, function(err, results) {

        console.log(results);

        Users.bulkCreate(results)
        .success(function(results) {
            console.log('Done creating Courses: ');
        })
        .error(function(error) {
            console.error(error);
        });

    });

});
