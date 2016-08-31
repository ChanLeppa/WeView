var signupForm;

// $(onLoad);
//
// function onLoad() {
// }

$(document).ready(function(){
    $('.parallax').parallax();
    $('.modal-trigger').leanModal();
    signupForm = $('#signup-form');
    validateSignupFileds();
    initLoginButtons();
    // userSignup({
    //     firstName: "Kelly",
    //     lastName: "Cute",
    //     username: "KellyC",
    //     email: "KellyDog@geemail.com",
    //     password: "123456"
    // });
});

function initLoginButtons() {
    $('#lname, #fname, #username_signup, #password_signup, #email').change(validateSignupFileds);
    // $('#btnGuest').click(guestLogin);
    // $('#submit-signup').click(submitSignup);
    // signupForm.submit(function(event) {
    //     event.preventDefault();
    // });
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

function userSignup(userLoginData) {
    // var data = {
    //     firstName: "Kelly",
    //     lastName: "Cute",
    //     username: "KellyC",
    //     email: "KellyDog@geemail.com",
    //     password: "123456"
    // };
    // $.post("/signup", JSON.stringify(userLoginData));
}

function userRedirect(response) {
    window.location.href = response;
}