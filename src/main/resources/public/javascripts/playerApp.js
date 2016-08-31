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
        messenger.connect(subscribeToUser);
        // messenger.subscribeToUser(userSubscriptionCallBack);
        getUserFriends();
        getUserPhoto();
        getUserFriendRequests();
    });
}

function subscribeToUser() {
    messenger.subscribeToUser(userSubscriptionCallBack);
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

function getUsername() {
    var url = $(location).attr('href');
    var splitURL = url.split("/");
    return splitURL[splitURL.length - 1];
}

function userSubscriptionCallBack(message, headers) {
    console.log("Server sent:" + message.body);
}
