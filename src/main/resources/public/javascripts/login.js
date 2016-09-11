var signupForm;
var loginForm;
$(onLoad);

function onLoad() {
    $('.parallax').parallax();
    $('.modal-trigger').leanModal();
    $('select').material_select();
    signupForm = $('#signup-form');
    loginForm = $('#login-form');

    validateSignupFileds();
    validateLoginFileds();
    initButtons();
}

function initButtons() {
    $('#lname, #fname, #username_signup, #password_signup, #email').change(validateSignupFileds);
    $('#username_login, #password_login').change(validateLoginFileds);
    $('#submit-signup').click(submitSignup);
    $('#submit-login').click(submitLogin);

    signupForm.submit(function(event) {
        event.preventDefault();
    });

    loginForm.submit(function (event) {
        event.preventDefault();
    });
}

function validateSignupFileds(){
    signupForm.validate();
    if ($('#fname').val().length > 0 &&
        $('#lname').val().length > 0 &&
        $('#username_signup').val().length > 0 &&
        $('#password_signup').val().length > 0 &&
        $('#email').val().length > 0 &&
        signupForm.valid()) {

        $('#submit-signup').removeClass('disabled');
    }
    else {
        $('#submit-signup').addClass('disabled');
    }
}

function validateLoginFileds(){
    loginForm.validate();
    if ($('#username_login').val().length > 0 &&
        $('#password_login').val().length > 0 &&
        loginForm.valid()) {

        $('#submit-login').removeClass('disabled');
    }
    else {
        $('#submit-login').addClass('disabled');
    }
}

// function guestLogin() {
//     console.log("gusetLogin");
//     $.get("/guest", userRedirect);
// }

function submitSignup() {
    var userSignupData = {
        firstName: $('#fname').val(),
        lastName: $('#lname').val(),
        username: $('#username_signup').val(),
        email: $('#email').val(),
        password: $('#password_signup').val(),
        icon: $('#icons').val()
    };

    userSignup(userSignupData);
}

function submitLogin() {
    var userLoginData = {
        username: $('#username_login').val(),
        password: $('#password_login').val()
    };

    userLogin(userLoginData);
}

function userSignup(userSignupData) {
    $.postJSON("/signup", userSignupData, userRedirect);
}

function userLogin(userLoginData) {
    $.postJSON("/login", userLoginData, userRedirect);
}

function userRedirect(response) {
    window.location.href = response;
}

$.postJSON = function(url, data, callback) {
    return jQuery.ajax({
        headers: {
            'Content-Type': 'application/json'
        },
        'type': 'POST',
        'url': url,
        'crossDomain': true,
        'data': JSON.stringify(data),
        'dataType': 'text',
        'success': callback,
        'error' : function(jqXHR, textStatus, errorThrown) {
            alert("Error, status = " + textStatus + ", " +
                "error thrown: " + errorThrown
            );
    }});
};