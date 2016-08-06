var btnGuest;
var btnLogin;
var btnRegister;

$(onLoad);

function onLoad() {
    initLoginButtons();
}

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