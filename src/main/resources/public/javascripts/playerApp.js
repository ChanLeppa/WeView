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
        $("#link-menu").closeModal();
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

    if (player !== null) {
        if(player.Video !== undefined){
            if(player.Video.src !== undefined){
                isExists = true;
            }
        }
        else if(player.Player !== undefined){
            if(player.Player.getVideoUrl() !== undefined){
                isExists = true;
            }
        }
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

    if (WeviewYoutubePlayer.isYoutubeSrc(src) === true) {
        initializeYoutubePlayer(playerID, src);
    }
    else {
        initializeVideoPlayer(playerID, src);
    }
}

//Youtube
///////////////////////////////////////////////////////////////////////////
function initializeYoutubePlayer(playerID, src) {
    player = new WeviewYoutubePlayer.YoutubePlayer(src);
    messenger.subscribeToPlayer(playerID, videoSubscriptionCallback);
    initializeYouTubePlayerControls();
}

function onYouTubeIframeAPIReady() {
    player.onYouTubeIframeAPIReady(onYouTubePlayerReady);
}

function onYouTubePlayerReady() {
    player.onPlayerReady();
}

function updateYouTubeProgressBar() {
    var duration = player.Player.getDuration();
    var currentTime = player.Player.getCurrentTime();
    setValuesToProgressBar(duration, currentTime);
};

function initializeYouTubePlayerControls() {
    // progressBar = $('#progress-bar');

    $('#play-pause-button').click(toggleYoutubePlay);
    $('#stop-button').click(onYoutubeStopPressed);
    $('#mute-button').click(toggleYoutubeMute);
    $('#vol-inc-button').click(onYoutubeVolumeUp);
    $('#vol-dec-button').click(onYoutubeVolumeDown);
    $('#fullscreen').click(function() {
        //TODO:not working
        $('#video-placeholder').webkitEnterFullscreen();
    });

    $('.progress-bar').mousedown(function(e) {
        timeDrag = true;
        sync(e.pageX, player.Player.getDuration());
    });

    $(document).mouseup(function(e) {
        if(timeDrag) {
            timeDrag = false;
            sync(e.pageX, player.Player.getDuration());
        }
    });

    $(document).mousemove(function(e) {
        if(timeDrag) {
            sync(e.pageX, player.Player.getDuration());
        }
    });
}

function onYoutubeVolumeUp(){
    var volume = player.Player.getVolume();
    player.Player.setVolume(volume === 100 ? 100 : (volume + 5));
}

function onYoutubeVolumeDown(){
    var volume = player.Player.getVolume();
    player.Player.setVolume(volume === 0 ? 0 : (volume - 5));
}

function toggleYoutubeMute(){
    if (player.Player.isMuted()){
        player.Player.unMute();
        changeButtonType($('#mute-button'), 'unmute', 'mute', "<i class='tiny material-icons'>volume_off</i>");
    } else{
        player.Player.mute();
        changeButtonType($('#mute-button'), 'mute', 'unmute', "<i class='tiny material-icons'>volume_mute</i>");
    }
}

function toggleYoutubePlay(){
    playerSyncData = preparePlayerSyncData(player.Player.getCurrentTime());
    if (player.Player.getPlayerState() !== window.YT.PlayerState.PLAYING){
        messenger.onPlayPressed(playerSyncData);
    } else{
        messenger.onPausePressed(playerSyncData);
    }
}

function onYoutubeStopPressed() {
    playerSyncData = preparePlayerSyncData(player.Player.getCurrentTime());
    messenger.onStopPressed(playerSyncData);
}
//end of youtube
///////////////////////////////////////////////////////////////////////////

//video
//////////////////////////////////////////////////////////////////////////
function initializeVideoPlayer(playerID, src) {
    player = new window.WeviewVideoPlayer.VideoPlayer(src);
    player.initializeVideoEvents(onCanPlay);
    messenger.subscribeToPlayer(playerID, videoSubscriptionCallback);
    initializeVideoPlayerControls();
}

function initializeVideoPlayerControls() {
    $('#play-pause-button').click(toggleVideoPlay);
    $('#stop-button').click(onVideoStopPressed);
    $('#mute-button').click(toggleVideoMute);
    $('#vol-inc-button').click(onVideoVolumeUp);
    $('#vol-dec-button').click(onVideoVolumeDown);
    $('#fullscreen').on('click', function() {
        player.Video.webkitEnterFullscreen();
        return false;
    });

    $('.progress-bar').mousedown(function(e) {
        timeDrag = true;
        sync(e.pageX, player.Video.duration);
    });

    $(document).mouseup(function(e) {
        if(timeDrag) {
            timeDrag = false;
            sync(e.pageX, player.Video.duration);
        }
    });

    $(document).mousemove(function(e) {
        if(timeDrag) {
            sync(e.pageX, player.Video.duration);
        }
    });
}

function toggleVideoPlay(){
    playerSyncData = preparePlayerSyncData(player.Video.currentTime);
    if (player.Video.paused){
        messenger.onPlayPressed(playerSyncData);
    } else{
        messenger.onPausePressed(playerSyncData);
    }
}

function toggleVideoMute(){
    if (player.Video.muted){
        changeButtonType($('#mute-button'), 'mute', 'unmute', "<i class='tiny material-icons'>volume_mute</i>");
        player.Video.muted = false;
    } else{
        changeButtonType($('#mute-button'), 'unmute', 'mute', "<i class='tiny material-icons'>volume_off</i>");
        player.Video.muted = true;
    }
}

function onVideoVolumeUp(){
    var volume = player.Video.volume;
    player.Video.volume += (volume === 1 ? 0 : 0.1);
}

function onVideoVolumeDown() {
    var volume = player.Video.volume;
    player.Video.volume -= (volume === 0 ? 0 : 0.1);
}

function onVideoStopPressed() {
    playerSyncData = preparePlayerSyncData(player.Video.currentTime);
    messenger.onStopPressed(playerSyncData);
}

//Player Controls Utils, same in youtube and video
//////////////////////////////////////////////////////////////////////////////////
function videoSubscriptionCallback(message, headers){
    player.subscriptionCallback(message, headers);
}

function onCanPlay() {
    messenger.onCanPlay();
}

function changeButtonType(button, valueToSet, valueToChange, innerHtml){
    button.html(innerHtml);
    button.attr("type", valueToSet);
    button.addClass(valueToSet).removeClass(valueToChange);
}

function sync(pageX, duration){
    var currentTime = getUpdatedTime(pageX, duration);
    playerSyncData = preparePlayerSyncData(currentTime);
    messenger.onSync(playerSyncData);
}

function formatTime(time){
    time = Math.round(time);

    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    return minutes + ":" + seconds;
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

function setValuesToProgressBar(duration, currentTime){
    $('#current').text(formatTime(currentTime));
    $('#duration').text(formatTime(duration));
    var percentage = Math.floor((100 / duration) * currentTime);
    $('#percentage').text(percentage);
    $('.time-bar').css('width', percentage+'%');
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
