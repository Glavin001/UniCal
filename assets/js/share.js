$(document).ready(function() {
    var share = new Share(".share-button", {
        ui: {
            flyout: 'bottom center'
        }
    });
    $('.share-button').css({
        'display': 'inline-block'
    });
});
