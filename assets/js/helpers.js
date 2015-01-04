// Handlebars Helpers
$(document).ready(function() {

    Handlebars.registerHelper("formatDate", function(datetime, format) {
        if (moment) {
            return moment(datetime).format(format);
        } else {
            return datetime;
        }
    });

    Handlebars.registerHelper("jsonStringify", function(obj) {
        if (typeof obj === "object" || obj instanceof Array) {
            return JSON.stringify(obj);
        } else {
            return obj;
        }
    });

    Handlebars.registerHelper('numberWithDigits', function(myNumber,
        digits) {
        if (digits != 2) {
            throw new Error(
                'Only 2 digits is currently supported.');
        }
        return ("0" + myNumber).slice(-2);
    });
});
