var signupForm;
var loginForm;
$(onLoad);

function onLoad() {
    $('.parallax').parallax();
    $('.modal-trigger').leanModal();
    signupForm = $('#signup-form');
    loginForm = $('#login-form');
    validateSignupFileds();
    initLoginButtons();
    // userSignup({
    //     firstName: "Kelly",
    //     lastName: "Cute",
    //     username: "KellyC",
    //     email: "KellyDog@geemail.com",
    //     password: "123456"
    // });
}

// $(document).ready(function(){
//     $('.parallax').parallax();
//     $('.modal-trigger').leanModal();
//     signupForm = $('#signup-form');
//     validateSignupFileds();
//     initLoginButtons();
//     // userSignup({
//     //     firstName: "Kelly",
//     //     lastName: "Cute",
//     //     username: "KellyC",
//     //     email: "KellyDog@geemail.com",
//     //     password: "123456"
//     // });
// });

function initLoginButtons() {
    $('#lname, #fname, #username_signup, #password_signup, #email').change(validateSignupFileds);
    // $('#btnGuest').click(guestLogin);
    $('#submit-signup').click(submitSignup);
    signupForm.submit(function(event) {
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
        password: $('#password_signup').val()
        // photo: $('#photo').val()
    };

    userSignup(userSignupData);
}

function userSignup(userSignupData) {
    $.postJSON("/signup", userSignupData, userRedirect);
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
        'data': JSON.stringify(data),
        'dataType': 'text',
        'success': callback,
        'error' : function(jqXHR, textStatus, errorThrown) {
            alert("Error, status = " + textStatus + ", " +
                "error thrown: " + errorThrown
            );
    }});
};