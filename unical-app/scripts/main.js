$(document).ready(function() {

    console.log('Hello world');

    // Elements
    var $searchCoursesBtn = $('.search-courses-btn');
    var $coursesOutput = $('#courses-output');
    var $selectedCoursesOutput = $('#selected-courses-output');
    var $subjectCode = $('#subject-code');
    var $courseNumb = $('#course-numb');
    var $submitBtn = $('.submit-btn');

    // Templates
    var coursesSource   = $("#courses-template").html();
    var coursesTemplate = Handlebars.compile(coursesSource);
    var selectedCoursesSource   = $("#selected-courses-template").html();
    var selectedCoursesTemplate = Handlebars.compile(selectedCoursesSource);

    // Courses
    var selectedCourses = [];

    // Helpers
    var getUniApi = function(callback) {
      $.get("/api/uniapi").done(function(data) {
        return callback && callback(data);
      });
    };

    var displaySelectedCourses = function() {
        // Refresh selected courses
        var context = { "courses": selectedCourses };
        var html = selectedCoursesTemplate(context);
        $selectedCoursesOutput.html(html);

        // Bind click events to remove courses
        $('.remove-course-btn', $selectedCoursesOutput).click(function() {
            var $el = $(event.target);
            console.log($el);
            var cData = JSON.parse($el.attr('data-course'));
            removeCourse(cData);
        });

    };

    var addCourse = function(course) {
        var idx = _.findIndex(selectedCourses, function(curr) {
            return curr.id === course.id;
        });
        if (idx == -1) {
            selectedCourses.push(course);
        }
        console.log(selectedCourses);
        displaySelectedCourses();
    };

    var removeCourse = function(course) {
        var id = course.id;
        var idx = _.findIndex(selectedCourses, function(curr) {
            return curr.id === id;
        });
        console.log(idx);
        if (idx > -1) {
            selectedCourses.splice(idx, 1);
        }
        console.log(selectedCourses);
        displaySelectedCourses();
    };

    var displayCourses = function(courses) {
        var context = {"courses": courses};
        var html = coursesTemplate(context);
        $coursesOutput.html(html);

        // Bind click events to add courses
        $('.add-course-btn', $coursesOutput).click(function() {
            var $el = $(event.target);
            console.log($el);
            var cData = JSON.parse($el.attr('data-course'));
            addCourse(cData);
        });
    }

    // Init
    displayCourses([]);
    displaySelectedCourses([]);
    
    // Main
    getUniApi(function(uniApi) {

        console.log(uniApi);
        var baseApiUrl = uniApi.protocol + "://" + uniApi.hostname + ":" +uniApi.port + "/api/v1/";

        var findCourses = function(query, callback) {
          var data = "where="+JSON.stringify(query.where)+"&limit="+query.limit;
          $.get(baseApiUrl + "courses", data)
          .done(function(data) {
            console.log(data);
            return callback && callback(data);
          });
        };

        var searchCourses = function() {
            //var where = {"Subj_code": $subjectCode.val(), "Crse_numb": $courseNumb.val() };
            /*
            var where = [
                "`Subj_code` LIKE '"+$subjectCode.val()+"%'",
                "`Crse_numb` LIKE '"+$courseNumb.val()+"%'"
                ];
            */
            var where = [
                "`Subj_code`='"+$subjectCode.val()+"' AND `Crse_numb`='"+$courseNumb.val()+"'"
                ];
            var limit = 10;

            findCourses({"where": where, "limit": limit }, function(courses) {
                console.log(courses);
                displayCourses(courses);
            })
        };

        var submitCourses = function(callback) {
            $.post("/api/calendar", {"courses": JSON.stringify(selectedCourses) }).done(function(data) {
                return callback && callback(data);
            });
        };

        $submitBtn.click(function() {
            $('a#calendarURL').text("Please wait...");
            submitCourses(function(data) {
                if (data && data.url) {
                    var calendarURL = window.location.origin + data.url;
                    
                    console.log(calendarURL);
                    console.log(data);

                    // Display data
                    $('a#calendarURL').text(calendarURL).attr('href', calendarURL);
                } else {
                    $('a#calendarURL').text("Please submit above and wait.");
                }
            });
        });

        // Add click handler
        $searchCoursesBtn.click(searchCourses);
        // Trigger virtual click
        $searchCoursesBtn.click();
        

    });

});
