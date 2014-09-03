#!/usr/bin/env node

var pkg = require('../package.json');
var fs = require('fs');
var path = require('path');
var program = require('commander');
var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');
var SelfService = require("self-service-banner");
var ProgressBar = require('progress');
var inquirer = require("inquirer");

program
    .version(pkg.version)
    .option('-o, --output [outputFile]', 'Output file for downloaded course schedules')
    .parse(process.argv);

if (!(program.output))
{
    console.error('Error: CLI requires output file paths.');
    process.exit();
    return;
}

// 
var banner = new SelfService();
// Get Terms
banner.getTerms(function(error, response, terms) {

  for(var i = 0, len=terms.length; i < len; i++){
      terms[i]["name"] = terms[i]["title"];
      delete terms[i]["title"];
  }
  var questions = [
    {
      'type': 'list',
      'name': 'term',
      'message': 'Select an available Term',
      'choices': terms
    }
  ];
  // Ask which Term
  inquirer.prompt( questions, function(answers) {
    // console.log(terms);
    // var term = terms[0];
    // console.log("Selected term "+term.title);
    var termv = answers.term; // term.value;
    // Get Subjects
    banner.getSubjects({
      p_term: termv
    }, function(error, response, subjects) {
      // console.log(subjects);

      var len = subjects.length;
      var bar = new ProgressBar('[:bar] Downloading Subjects', { total: len });

      var tasks = [];
      for (var s=0; s<len; s++) {
        var subj = subjects[s];
        // console.log("Selected subject "+subject.title);
        (function(subject, termv) {
          var subjectv = subject.value;
          // Create task
          var task = function(callback) {
            // Update download message
            // Get Courses Schedule
            banner.getCoursesSchedule({
              'term_in': termv,
              'sel_subj': subjectv
            }, function(error, response, courses) {
              bar.fmt = '[:bar] Finished downloading '+subject.title+': :percent (:current of :total subjects downloaded)';
              bar.tick(1);
              // console.log('Loaded '+courses.length+' course schedules.');
              callback(null, courses);
            });
          }
          tasks.push(task);
        })(subj, termv);
      }

      async.parallel(tasks, function(err, results) {
        // Merge courses from all subjects into aggregate list of courses
        var allCourses = _.flatten(results, true);
        console.log('Loaded '+allCourses.length+' courses!');

        // Create file contents
        var data = JSON.stringify(allCourses, null, 4)

        // write file
        var outputFilePath = path.resolve(program.output);
        fs.writeFile(outputFilePath, data, function(err) {
            if(err) {
              console.log(err);
            } else {
              console.log("JSON saved to " + outputFilePath);
            }
        });

      });

    });

  });
});