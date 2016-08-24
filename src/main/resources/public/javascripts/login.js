var btnGuest;
var btnLogin;
var btnRegister;

$(onLoad);

function onLoad() {
    initLoginButtons();
}

$(document).ready(function(){
    $('.parallax').parallax();
    $('.modal-trigger').leanModal();
    // $('#submit-login').prop('disabled',true);
    // $('#submit-signup').prop('disabled',true);
});

function initLoginButtons() {
    $('#btnGuest').click(guestLogin);
}

function guestLogin() {
    console.log("gusetLogin");
    $.get("/guest", userRedirect);
}

function userLogin() {

}

function register() {

}

function userRedirect(response) {
    window.location.href = response;
}