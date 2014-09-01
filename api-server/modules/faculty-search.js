var request = require("request");
var cheerio = require("cheerio");

module.exports = function(fname, lname, callback) {
    var url = "http://smuphone.smu.ca/sscript/";
    var info = {};
    
    //console.log(fname, lname);

    request.post(
        url + 'search.asp', {
            form: {
                'txtLastName': lname,
                'txtFirstName': fname,
                'cmdSubmit': 'Submit'
            }
        },
        function(error, response, body) {
            
            //console.log(body);

            if (!error && response.statusCode == 200) {
                //console.log(body);
                $ = cheerio.load(body);
                name = $('a[href^="employeeinfo.asp?"]');
                if (name.length == 1) {
                    var href = name.attr('href');
                    request(url + href, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            //console.log("2nd Request:\n" + body);
                            
                            $ = cheerio.load(body);
                            var table = $('.tableb td');
                            // console.log(table.length);   
                            table.each(function(id) {
                                switch (id) {
                                    case 1:
                                        info.phone = $(this).text();
                                        break;
                                    case 5:
                                        info.office = $(this).text();
                                        break;
                                    case 7:
                                        info.department = $(this).text();
                                        break;
                                    case 9:
                                        info.departmentphone = $(this).text();
                                        break;
                                }
                                // console.log("ID:" + id+"\n");
                            });
                            info.email = $('a[href^="mailto:"]').text();
                            // console.log(JSON.stringify(info));
                            callback(null, info);
                        } else {
                            callback(error, []);
                            console.log("Error Code:" + response.statusCode + "\nError: " + JSON.stringify(error) + "\nResponse: " + JSON.stringify(response.headers));
                            info = null;
                        }
                    });
                    info.name = name.text();
                } else {
                    console.log("Search didnt return anything.");
                    callback(null, []);
                }

            } else {
                callback(error, []);
                console.log("Error Code:" + response.statusCode + "\nError: " + JSON.stringify(error) + "\nResponse: " + JSON.stringify(response.headers));
                info = null;
            }
        }
    );
    return info ? info : null;
};