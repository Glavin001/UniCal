$(document).ready(function() {

    // Elements
    var $searchCoursesBtn = $('.search-courses-btn');
    var $coursesOutput = $('#courses-output');
    var $selectedCoursesOutput = $('#selected-courses-output');
    var $subjectCode = $('#subject-code');
    var $courseNumb = $('#course-numb');
    var $submitBtn = $('.submit-btn');

    // Templates
    var coursesSource = $("#courses-template").html();
    var coursesTemplate = Handlebars.compile(coursesSource);
    var selectedCoursesSource = $("#selected-courses-template").html();
    var selectedCoursesTemplate = Handlebars.compile(
        selectedCoursesSource);

    // Courses
    var selectedCourses = [];

    var displaySelectedCourses = function() {
        // Refresh selected courses
        var context = {
            "courses": selectedCourses
        };
        var html = selectedCoursesTemplate(context);
        $selectedCoursesOutput.html(html);

        // Bind click events to remove courses
        $('.remove-course-btn', $selectedCoursesOutput).click(
            function() {
                var $el = $(event.target);
                console.log($el);
                var cData = JSON.parse($el.attr('data-course'));
                removeCourse(cData);
            });

    };

    var addCourse = function(course) {
        var idx = _.findIndex(selectedCourses, function(curr) {
            return curr._id === course._id;
        });
        if (idx == -1) {
            selectedCourses.push(course);
        }
        console.log(selectedCourses);
        displaySelectedCourses();
    };

    var removeCourse = function(course) {
        var id = course._id;
        var idx = _.findIndex(selectedCourses, function(curr) {
            return curr._id === id;
        });
        console.log(idx);
        if (idx > -1) {
            selectedCourses.splice(idx, 1);
        }
        console.log(selectedCourses);
        displaySelectedCourses();
    };

    var displayCourses = function(courses) {
        var context = {
            "courses": courses
        };
        var html = coursesTemplate(context);
        $coursesOutput.html(html);

        // Bind click events to add courses
        $('.add-course-btn', $coursesOutput).click(function() {
            var $el = $(event.target);
            console.log($el);
            var cData = JSON.parse($el.attr('data-course'));
            addCourse(cData);
        });
    };

    // Init
    displayCourses([]);
    displaySelectedCourses([]);

    // Main
    var baseApiUrl = "/api/v1/";

    var findCourses = function(query, callback) {
        var data = [];

        _.each(_.keys(query), function(key) {
            data.push(key + "=" + JSON.stringify(query[key]));
            // "where="+JSON.stringify(query.conditions)+"&options="+JSON.stringify(query.options);
        });
        var dataStr = data.join('&');

        $.get(baseApiUrl + "courses", dataStr)
            .done(function(data) {
                console.log(data);
                return callback && callback(data);
            });
    };

    var searchCourses = function() {
        var conditions = {};
        var subjCode = $subjectCode.val();
        var crseNumb = $courseNumb.val();
        console.log(subjCode, crseNumb);
        if (subjCode)
            conditions.Subj_code = subjCode;
        if (crseNumb)
            conditions.Crse_numb = crseNumb;
        // var limit = 10;
        findCourses({
            "where": conditions,
            // "limit": limit
        }, function(courses) {
            console.log(courses);
            displayCourses(courses);
        });
    };

    var submitCourses = function(callback) {
        $.post("/api/calendar", {
            "courses": JSON.stringify(selectedCourses)
        }).done(function(data) {
            return callback && callback(data);
        });
    };

    // Display stats
    var getCalendarCount = function(callback) {
        $.get('/api/v1/calendars/count').done(function(stats) {
            return callback && callback(stats);
        });
    };
    function displayCalendarCount() {
        getCalendarCount(function(stats) {
            $('.calendars-created-count').text(stats.value);
        });
    }
    var getCourseCount = function(callback) {
        $.get('/api/v1/courses/count').done(function(stats) {
            return callback && callback(stats);
        });
    };
    function displayCoursesCount() {
        getCourseCount(function(stats) {
            $('.courses-count').text(stats.value);
        });
    }

    function displayStats() {
        displayCalendarCount();
        displayCoursesCount();
    }
    setInterval(displayStats, 5 * 1000); // Update Stats every 5 seconds
    displayStats(); // Init

    $submitBtn.click(function() {
        $('a#calendarURL').text("Please wait...");
        submitCourses(function(data) {
            if (data && data.url) {
                var calendarURL = window.location.origin +
                    data.url;

                console.log(calendarURL);
                console.log(data);

                // Display data
                $('a#calendarURL').text(calendarURL).attr(
                    'href', calendarURL);
            } else {
                $('a#calendarURL').text(
                    "Please submit above and wait."
                );
            }
        });
    });

    // Add click handler
    $searchCoursesBtn.click(searchCourses);
    // Trigger virtual click
    $searchCoursesBtn.click();

});
