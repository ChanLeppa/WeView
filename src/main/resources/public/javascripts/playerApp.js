var messenger;
var friends;
var userData;

$(onLoad());

function onLoad() {
    $(".dropdown-button").dropdown();
    $(".modal-trigger").leanModal();
    initUser();
}

function initUser() {
    var dest = "/user/" + getUsername() + "/user-data";
    $.get(dest, function (response) {
        userData = response;
        messenger = new window.WeviewSocketMessaging.SocketMessenger(userData.username);
        messenger.connect()
            .then(onWebSocketConnection)
            .then(getUserFriends)
            .then(sendUserLogin)
            .catch(onWebSocketConnectionError);
        getUserPhoto();
        getUserFriendRequests();
    });
}

function getUserFriends() {
    var dest = "/user/" + userData.username + "/friends";
    $.get(dest, function (response) {
        userData.friends = response.friends;
    });
}

function getUserPhoto() {
    var dest = "/user/" + userData.username + "/photo";
    $.get(dest, function (response) {
        userData.photo = response;
    });
}

function getUserFriendRequests() {
    var dest = "/user/" + userData.username + "/friend-requests-notifications";
    $.get(dest, function (response) {
        userData.friendRequests = response;
    });
}

function onWebSocketConnection() {
    messenger.subscribeToUser(userSubscriptionCallBack);
}

function sendUserLogin() {
    messenger.sendUserLogin(userData.friends);
}

function userSubscriptionCallBack(message, headers) {
    var msg = JSON.parse(message.body);
    console.log("Server sent:" + message.body);

    switch (msg.event) {
        case "login":
            console.log(msg.username + " logged in.");
            break;
        case "logout":
            console.log(msg.username + " logged out.");
            break;
        case "invite":
            console.log(msg.username + " invited you to watch.");
            break;
        case "acceptInvite":
            console.log(msg.username + " accepted your invitation to watch.");
            break;
    }

}

function getUsername() {
    var url = $(location).attr('href');
    var splitURL = url.split("/");
    return splitURL[splitURL.length - 1];
}

function onWebSocketConnectionError(error) {
    console.log(error);
    alert("Error: Unable to connect to websocket.");
}
