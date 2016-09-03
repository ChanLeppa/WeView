var messenger = null;
var friends;
var userData = null;
var videoControls;
var playerSyncData;
var player = null;
var timeDrag = false;

$(onLoad());

function onLoad() {
    $(".dropdown-button").dropdown();
    $(".modal-trigger").leanModal();
    videoControls = $("#video-controls").html();
    initUser()
        .then(updateDropboxControls);
    initVideoLinkButton();
}

function initVideoLinkButton() {
    $('#link-url-form').submit(function (event) {
        event.preventDefault();
    });

    $('#btnVideoLink').click(function() {
        var linkTag = $('#link-URL');
        var videoSrc = linkTag[0].value;
        linkTag.trigger('autoresize');
        linkTag.val('');
        linkTag.trigger('autoresize');

        onNewSrcChosen(videoSrc);
    });
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

function onNewSrcChosen(src) {
    if (!playerExists()) {
        createPlayer(src);
    }
    else {
        updatePlayerSrc(src);
    }
}

function playerExists() {
    var isExists = false;

    if (player != null && player.video.src !== undefined) {
        isExists = true;
    }

    return isExists;
}

function createPlayer(src) {
    var dest = "/user/" + userData.username + "/create-player";
    return new Promise(function (resolve, reject) {
        $.post(dest, src, function (response) {
            console.log(response);
            initializePlayer(userData.username, decodeURIComponent(src));
            resolve(response);
        });
    });
}

function updatePlayerSrc(src) {
    //TODO: update progress bar
    messenger.updatePlayerSrc(src);
}

function initializePlayer(playerID, src) {
    //TODO: depends on the src (youtube or other)
    $('#video-controls').empty().append(videoControls);

    if (WeviewYoutubePlayer.isYoutubeSrc(src)) {
        initilizeYoutubePlayer(src);
    }
    else {
        initializeVideoPlayer(playerID, src);
    }
}

function initilizeYoutubePlayer(src) {
    player = new WeviewYoutubePlayer.YoutubePlayer(src);
}

function onYouTubeIframeAPIReady() {
    // var videoId = player.YoutubeVideoUrl;
    // var onPlayerReady = player.onPlayerReady;
    // player.Player = new YT.Player('video-placeholder', {
    //     width: 990.16,
    //     height: 556.95,
    //     videoId: videoId,
    //     playerVars: {
    //         'controls': 0,
    //         'showinfo': 0,
    //         'autohide': 1
    //     },
    //     events: {
    //         'onReady': onPlayerReady
    //     }
    // });
    player.onYouTubeIframeAPIReady();
}

function initializeVideoPlayer(playerID, src) {
    player = new window.WeviewVideoPlayer.VideoPlayer(src);
    player.initializeVideoEvents(onCanPlay);
    messenger.subscribeToPlayer(playerID, videoSubscriptionCallback);
    initializeVideoPlayerControls();
}

function videoSubscriptionCallback(message, headers){
    player.subscriptionCallback(message, headers);
}

function initializeVideoPlayerControls() {
    $('#play-pause-button').click(toggleVideoPlay);
    $('#stop-button').click(onVideoStopPressed);
    $('#mute-button').click(toggleVideoMute);
    $('#vol-inc-button').click(onVideoVolumeUp);
    $('#vol-dec-button').click(onVideoVolumeDown);
    $('#fullscreen').on('click', function() {
        player.video.webkitEnterFullscreen();
        return false;
    });

    $('.progress-bar').mousedown(function(e) {
        timeDrag = true;
        syncVideo(e.pageX, player.video.duration);
    });

    $(document).mouseup(function(e) {
        if(timeDrag) {
            timeDrag = false;
            syncVideo(e.pageX, player.video.duration);
        }
    });

    $(document).mousemove(function(e) {
        if(timeDrag) {
            syncVideo(e.pageX, player.video.duration);
        }
    });
}

function toggleVideoPlay(){
    playerSyncData = preparePlayerSyncData(player.video.currentTime);
    if (player.video.paused){
        messenger.onPlayPressed(playerSyncData);
    } else{
        messenger.onPausePressed(playerSyncData);
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

function onVideoVolumeUp(){
    var volume = player.video.volume;
    player.video.volume += (volume === 1 ? 0 : 0.1);
}

function onVideoVolumeDown() {
    var volume = player.video.volume;
    player.video.volume -= (volume === 0 ? 0 : 0.1);
}

//Player Controls Utils, same in youtube and video
//////////////////////////////////////////////////////////////////////////////////
function onCanPlay() {
    messenger.onCanPlay();
}

function onVideoStopPressed() {
    playerSyncData = preparePlayerSyncData(player.video.currentTime);
    messenger.onStopPressed(playerSyncData);
}

function changeButtonType(button, valueToSet, valueToChange, innerHtml){
    button.html(innerHtml);
    button.attr("type", valueToSet);
    button.addClass(valueToSet).removeClass(valueToChange);
}

function syncVideo(pageX, duration){
    var currentTime = getUpdatedTime(pageX, duration);
    playerSyncData = preparePlayerSyncData(currentTime);
    messenger.onSync(playerSyncData);
}

function preparePlayerSyncData(currentTime){
    return  {time : parseFloat(currentTime).toFixed(1)};
}

function getUpdatedTime(x, duration) {
    var progress = $('.progress-bar');
    var maxduration = duration; //video duraiton
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
//End of player Controls utils
/////////////////////////////////////////////////////////////////////////////////////

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
            onNewSrcChosen(src);
        });
    });
}
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
