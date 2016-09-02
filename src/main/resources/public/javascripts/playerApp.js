var messenger;
var friends;
var userData;
var videoControls;
var onSrcChosenEvent = $.Deferred();
var playerSyncData;
var timeDrag = false;

$(onLoad());

function onLoad() {
    $(".dropdown-button").dropdown();
    $(".modal-trigger").leanModal();
    videoControls = $("#video-controls").html();
    initUser()
        .then(updateDropboxControls);
    onSrcChosenEvent.done(createPlayer);
}

function initUser() {
    var dest = "/user/" + getUsername() + "/user-data";
    return new Promise(function (resolve, reject) {
        $.get(dest, function (response) {
            userData = response;
            messenger = new window.WeviewSocketMessenger.SocketMessenger(userData.username);
            messenger.connect()
                .then(onWebSocketConnection)
                .then(getUserFriends)
                .then(sendUserLogin)
                .catch(onWebSocketConnectionError);
            getUserPhoto();
            getUserFriendRequests();
            resolve();
        });
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

function createPlayer(src) {
    var dest = "/user/" + userData.username + "/create-player";
    return new Promise(function (resolve, reject) {
        $.post(dest, src, function (response) {
            console.log(response);
            //TODO: initialize player
            initializePlayer(userData.username, decodeURIComponent(src));
            resolve(response);
        });
    });
}

function initializePlayer(playerID, src) {
    //TODO: depends on the src (youtube or other)
    $('#video-controls').empty().append(videoControls);

    // if (isYoutubeSrc(src)) {
    //     initilizeYoutubePlayer(src);
    // }
    // else {
        initializeVideoPlayer(playerID, src);
    // }
}

function initializeVideoPlayer(playerID, src) {
    var player = new window.WeviewVideoPlayer.VideoPlayer(src);
    player.initializeVideoEvents(onCanPlay);
    messenger.subscribeToPlayer(playerID, player.subscriptionCallback);
}

function initializeVideoPlayerControls() {
    $('#play-pause-button').click(toggleVideoPlay);
    $('#stop-button').click(onStopPressed);
    $('#mute-button').click(toggleVideoMute);
    $('#vol-inc-button').click();
    $('#vol-dec-button').click();
    $('#fullscreen').on('click', function() {
        player.video.webkitEnterFullscreen();
        return false;
    });

    $('.progress-bar').mousedown(function(e) {
        timeDrag = true;
        syncVideo(e.pageX);
    });

    $(document).mouseup(function(e) {
        if(timeDrag) {
            timeDrag = false;
            syncVideo(e.pageX);
        }
    });

    $(document).mousemove(function(e) {
        if(timeDrag) {
            syncVideo(e.pageX);
        }
    });
}

function onCanPlay() {
    messenger.onCanPlay();
}

function onStopPressed() {
    messenger.onStopPressed("");
}

function toggleVideoPlay(){
    if (player.video.paused){
        messenger.onPlayPressed("");
    } else{
        messenger.onPausePressed("");
    }
}

function toggleVideoMute(){
    if (player.video.muted){
        changeButtonType($('#mute-button'), 'mute', 'unmute', "<i class='tiny material-icons'>volume_mute</i>");
        player.video.muted = false;
    } else{
        changeButtonType($('#mute-button'), 'unmute', 'mute', "<i class='tiny material-icons'>volume_off</i>");
        player.video.muted = true;
    }
}

function onVideoVolumeChanged(direction){
    var volume = player.video.volume;

    if(direction === '+'){
        player.video.volume += (volume === 1 ? 0 : 0.1);
    }
    else{
        player.video.volume -= (volume === 0 ? 0 : 0.1);
    }
}

function syncVideo(pageX){
    var currentTime = getUpdatedTime(pageX, player.video.duration);
    playerSyncData = {
        // callBackName: "Sync",
        // time : parseFloat(currentTime).toFixed(1),
        // canPlay: true,
        // playing: !video.paused
    };
    messenger.onSync(playerSyncData);
}

//same in youtube and video
function getUpdatedTime(x, duration) {
    var progress = $('.progress-bar');
    var maxduration = duration; //Video duraiton
    var position = x - progress.offset().left; //Click pos
    var percentage = 100 * position / progress.width();

    //Check within range
    if(percentage > 100) {
        percentage = 100;
    }
    if(percentage < 0) {
        percentage = 0;
    }

    return maxduration * percentage / 100;
}

//Dropbox
/////////////////////////////////////////////////////////////////////////////////////
function updateDropboxControls() {
    if(userData.dbxTokenExists === true) {
        $('#reg-dropbox-button').remove();
        $('#reg-dropbox-list').append("<a href='#dropbox-modal' id='choose-video-dropbox-button' class='modal-trigger light-blue-text text-accent-3'>Choose video to watch</a>");
        $('.modal-trigger#choose-video-dropbox-button').leanModal();
        $('#reg-dropbox-list').on("click", "#choose-video-dropbox-button", function() {
            getFileNames();
        });
    }
    else {
        initDropBoxSignInButton();
    }
}

function initDropBoxSignInButton(){
    $('#reg-dropbox-button').click(function(){
        var dest = "/user/" + userData.username + "/dropbox";
        $.get(dest, function(response) {
            location.href = response;
        });
    })
}

function getFileNames(){
    var dest = "/user/" + userData.username + "/filenames";
    $.get(dest, function(response) {
        $('div#filenames').html("");
        $.each(response, addDropboxFileNameToHtml);
    });
}

function addDropboxFileNameToHtml(index, fileName){
    //first chaeck the video format...if it is video only then add to the page
    var b = "<li class='collection-item'><div>" + fileName + "<a href='#' id='dbx-button" + index + "' class='secondary-content'><i class='material-icons blue-text text-accent-2'>send</i></a></div></li>";

    $('div#filenames').append(b);
    $('div#filenames').on("click", "#dbx-button" + index, function () {
        var dest = "/user/" + userData.username + "/dbxfilelink";
        $.get(dest, { fileName : fileName }, function(src) {
            $('#dropbox-modal').closeModal();
            onSrcChosenEvent.resolve(src);
        });
    });
}

// function getDropboxLinkToFile(fileName) {
//     var dest = "/user/" + userData.username + "/dbxfilelink";
//     $.get(dest, { fileName : fileName }, function(src) {
//         $('#dropbox-modal').closeModal();
//         onSrcChosenEvent.resolve(src);
//     });
// }
//end dropbox
///////////////////////////////////////////////////////////////////////////////
function getUsername() {
    var url = $(location).attr('href');
    var splitURL = url.split("/");
    return splitURL[splitURL.length - 1];
}

function onWebSocketConnectionError(error) {
    console.log(error);
    alert("Error: Unable to connect to websocket.");
}

//Player Controls Utils
//////////////////////////////////////////////////////////////////////////////////
function changeButtonType(button, valueToSet, valueToChange, innerHtml){
    button.html(innerHtml);
    button.attr("type", valueToSet);
    button.addClass(valueToSet).removeClass(valueToChange);
}

//end player controls
///////////////////////////////////////////////////////////////////////////////////