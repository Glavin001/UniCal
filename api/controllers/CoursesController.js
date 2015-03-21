/**
 * CoursesController
 *
 * @description :: Server-side logic for managing Courses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var SelfService = require("self-service-banner");

module.exports = {

    // Updating Courses from Banner

    // lastUpdated: null,
    // updateInProgress: false,
    // progressMessage: null,
    "status": function(req, res) {
        return res.json({
            "message": this.progressMessage
        });
    },
    "count": function(req, res) {
        Courses.count(function(err, result) {
            return res.json({
                "value": result
            });
        });
    },
    "updateTerm": function(req, res) {
        var self = this;

        if (false && self.updateInProgress === false) {
            // Respond
            return res.json({
                "startingUpdate": false,
                "currentlyUpdating": self.updateInProgress,
                "lastUpdated": self.lastUpdated,
                "progress": self.progressMessage
            });
        } else {

            // Not pending

            // Get Term
            var term = req.allParams().term;

            if (!term) {
                return res.badRequest({
                    message: "Please provide a `term`."
                });
            }

            self.updateInProgress = term; // Lock
            self.progressMessage = "Starting to update term " + term;

            // Respond
            res.json({
                "startingUpdate": true,
                "currentlyUpdating": self.updateInProgress,
                "lastUpdated": self.lastUpdated,
                "progress": self.progressMessage
            });

            try {

                // Create SelfService connection
                var banner = new SelfService();

                // Download courses for term
                var downloadTerm = function(termv, banner, callback) {

                    // Get Subjects
                    banner.getSubjects({
                        p_term: termv
                    }, function(error, response, subjects) {
                        // sails.log.debug(subjects);

                        var len = subjects.length;
                        // var bar = new ProgressBar(
                        //     '[:bar] Downloading Subjects', {
                        //         total: len,
                        //         stream: self.progressMessage
                        //     });

                        var taskFun = function(subject,
                            termv) {
                            var subjectv = subject.value;
                            // Create task
                            var task = function(
                                callback) {
                                // Update download message
                                // Get Courses Schedule
                                banner.getCoursesSchedule({
                                    'term_in': termv,
                                    'sel_subj': subjectv
                                }, function(
                                    error,
                                    response,
                                    courses
                                ) {
                                    sails.log
                                        .debug(
                                            'Loaded ' +
                                            courses
                                            .length +
                                            ' course schedules for subject ' +
                                            subjectv +
                                            '.'
                                        );
                                    callback
                                        (
                                            null,
                                            courses
                                        );
                                });
                            };
                            tasks.push(task);
                        };

                        var tasks = [];
                        for (var s = 0; s < len; s++) {
                            var subj = subjects[s];
                            // sails.log.debug("Selected subject "+subject.title);
                            taskFun(subj, termv);
                        }

                        async.parallel(tasks, function(err,
                            results) {

                            // Merge courses from all subjects into aggregate list of courses
                            var allCourses = _.flatten(
                                results, true);
                            sails.log.debug(
                                'Loaded ' +
                                allCourses.length +
                                ' courses!');

                            return callback(null,
                                allCourses);

                        });
                    });
                };

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
                        if (s[1].indexOf("pm") != -1 && hours != 12) {
                            hours += 12;
                        }
                        return {
                            'hours': hours,
                            'minutes': minutes
                        };
                        // return (hours * 100)+minutes;
                    } catch (e) {
                        return null;
                    }
                };

                var normalizeCourse = function(row) {
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
                    if (_.contains(d, 'M')) { // Monday
                        row.Mon_day = '1';
                    }
                    if (_.contains(d, 'T')) { // Tuesday
                        row.Tue_day = '1';
                    }
                    if (_.contains(d, 'W')) { // Wednesday
                        row.Wed_day = '1';
                    }
                    if (_.contains(d, 'R')) { // Thursday
                        row.Thu_day = '1';
                    }
                    if (_.contains(d, 'F')) { // Friday
                        row.Fri_day = '1';
                    }
                    if (_.contains(d, 'S')) { // Saturday
                        row.Sat_day = '1';
                    }
                    if (_.contains(d, 'U')) { // Sunday
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
                    row.Faculty = row.instructors;
                    delete row.instructors;

                    // Return
                    return row;
                };

                var loadCourses = function(allCourses, callback) {

                    sails.log.debug("loadCourses: " + allCourses.length);

                    // Process Data
                    var data = [];

                    // Create row Object with headers
                    async.map(allCourses, function(course, callback) {
                        // Check if Cancelled
                        if (course.title === "*CANCELLED*") {
                            // var e = new Error(
                            //     "Course has been cancelled"
                            // );
                            // sails.log.error(e);
                            return callback(null, null);
                        }
                        normalizeCourse(course);
                        return callback(null, course);
                    }, function(err, results) {

                        sails.log.debug(err, results.length);

                        Courses.native(function(err,
                            collection) {

                            async.map(results,
                                function(data,
                                    callback) {
                                    if (data) {
                                        sails.log
                                            .debug(
                                                "Updating course " +
                                                data
                                                .Subj_code +
                                                " " +
                                                data
                                                .Crse_numb
                                            );
                                        collection
                                            .update({
                                                    'crn': data
                                                        .crn
                                                },
                                                data, {
                                                    upsert: true
                                                },
                                                function(
                                                    err
                                                ) {
                                                    if (
                                                        err
                                                    ) {
                                                        sails
                                                            .log
                                                            .debug(
                                                                "An error occured: ",
                                                                err
                                                            );
                                                    }
                                                    callback
                                                        (
                                                            err
                                                        );
                                                }
                                            );
                                    } else {
                                        callback
                                            (
                                                null
                                            );
                                    }
                                },
                                function(errors) {
                                    callback(
                                        errors
                                    );
                                }
                            );
                        });

                    });

                };

                // Load courses into database
                downloadTerm(term, banner, function(err, allCourses) {
                    if (err) {
                        throw err;
                    }

                    sails.log.debug("# of Courses: " +
                        allCourses.length);

                    loadCourses(allCourses, function(err) {
                        sails.log.debug(
                            "Done loading courses",
                            err);

                        // Mark completion
                        self.lastUpdated = new Date();

                        // Unlock
                        self.updateInProgress = false;

                    });


                });

            } catch (e) {
                self.updateInProgress = false;
            }

        }
    },

    subjects: function(req, res) {
        sails.models.courses.native(function(err, collection) {

            collection.aggregate({
                "$group": {
                    "_id": "subjects",
                    "total": {
                        "$addToSet": "$Subj_code"
                    }
                }
            }, function(err, results) {

                return res.json(results[0].total);

            });

        });
    }


};