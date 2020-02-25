/* global moment */

var ageCalculator = {
    'getParameterByName': function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    'stringToEncodings': function(input) {
        var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
        var outputObject = {};

        if (base64Matcher.test(input)) {
            outputObject.base64 = input;
            outputObject.string = atob(input);
        } else {
            outputObject.base64 = btoa(input);
            outputObject.string = input;
        }

        return outputObject;
    },
    'processInput': function() {
        var inputString = $('#birthDate').val();
        var uriString;

        if (moment(inputString).isValid()) {
            uriString = ageCalculator.stringToEncodings(moment(inputString).format('YYYY-MM-DD')).base64;
            
            window.location.search = 'd=' + uriString;
        }
    },
    'initPage': function() {
        var birthDate = ageCalculator.getParameterByName('d') || ageCalculator.getParameterByName('birthDate') || false;
        var inputMoment, birthdayMoment, ageYears, outputString;

        $('#app').html('');

        if (birthDate) {
            inputMoment = moment(ageCalculator.stringToEncodings(birthDate).string);
            birthDate = inputMoment.format('YYYY-MM-DD');
            birthdayMoment = inputMoment.format('MM-DD');
            ageYears = moment().diff(birthDate, 'years');
            outputString = 'You are ' + ageYears + ' years old.';

            document.title = outputString;

            $('#app').append($('<p class="age">' + outputString + '</p>'))
            
            if (birthdayMoment == moment().format('MM-DD')) {
                $('#app').append($('<p class="happy-birthday">Happy Birthday!!!</p>'));
            }
            
            $('<button id="resetButton">Reset</button>')
                .appendTo('#app')
                .click(function(){
                    //window.history.pushState({}, '', '/');
                    //ageCalculator.initPage();
                    window.location.search = '';
                });
        } else {
            $('<div id="ageForm" class="form"></div>').appendTo('#app');
            $('<label for="birthDate">Birth Date:</label>').appendTo('#ageForm');
            $('<input id="birthDate" placeholder="Ex. Jan 1, 1970" />')
                .appendTo('#ageForm')
                .keypress(function(e){
                    if (e.which == 13) {
                        ageCalculator.processInput();
                    }
                });
            $('<button id="submitButton">What\'s my age?</button>')
                .appendTo('#ageForm')
                .click(ageCalculator.processInput);
        }
    }
}