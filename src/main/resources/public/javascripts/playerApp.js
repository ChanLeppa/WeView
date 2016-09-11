var messenger = null;
var friends;
var userData = null;
var videoControls;
var playerSyncData;
var player = null;
var youtubePlayer = null;
var youtubeIframe = null;
var videoPlayer = null;
var timeDrag = false;
var selfView = null;
var remoteView = null;
var roomID = null;
var peerConn = null;
var localMediaStream = null;
var weviewYoutubeVideoLink = "https://www.youtube.com/watch?v=WjecjXenxOA";

$(onLoad());

function onLoad() {
    initPageButtons();
    videoControls = $("#video-controls").html();
    $("#video-controls").empty();
    initUser()
        .then(updateDropboxControls)
        // .then(loadInitialYoutubePlayer);
    initVideoLinkButton();
}

function initPageButtons() {
    $(".dropdown-button").dropdown();
    $(".modal-trigger#linkBtn").leanModal({
        complete: restartLinkModal
    });
    $(".modal-trigger#searchFriendsBtn").leanModal({
        complete: restartSearchModal
    });
    $(".modal-trigger#friend-requestsBtn").leanModal({
        // ready: updateFriendRequest
    });
    $("#logoutBtn").click(logout);
    $("#search-input").change(function () {
        if ($('#search-input').val().length > 0) {
            $('#searchBtn').removeClass('disabled');
        }
        else {
            $('#searchBtn').addClass('disabled');
        }
    });
    $("#link-URL").change(function () {
        if ($('#link-URL').val().length > 0) {
            $('#btnVideoLink').removeClass('disabled');
        }
        else {
            $('#btnVideoLink').addClass('disabled');
        }
    });
    $("#searchBtn").click(searchFriend);
}

function initUserDetails() {
    var details = "<div class='chip right'><img src='" + findIconPathByIconName(userData.icon) + "' alt='Contact Person'>" + userData.username + "</div>";
    $("#user-details").empty().html(details);
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
            getUserFriendRequests();
            setInterval(getUserFriendRequests, 60000);
            initUserDetails();
            resolve();
        });
    });
}

function getUserFriends() {
    var dest = "/user/" + userData.username + "/friends";
    return new Promise(function(resovle, reject) {
        $.get(dest, function (response) {
            userData.friends = response.friends;
            showUserFriends();
            resovle();
        });
    });
}

function searchFriend() {
    $("#search-result").empty();
    var friendResult;
    var searchParam = $('#search-input').val();

    if(searchParam === userData.username || searchParam === userData.email){
        friendResult = "<div class='center-align card-panel blue accent-3'><span class='white-text'>It's you :)</span></div>";
        $("#search-result").append(friendResult);
    }
    else if(isSearchParamMyFriend(searchParam)){
        friendResult = "<div class='center-align card-panel blue accent-3'><span class='white-text'>" + searchParam + " is already your friend!</span></div>";
        $("#search-result").append(friendResult);
    }
    else{
        sendSearchRequest(searchParam);
    }
}

function isSearchParamMyFriend(searchParam) {
    var isFriend = false;
    $.each(userData.friends, function (index, friend) {
        if(friend.username === searchParam || friend.email === searchParam){
            isFriend = true;
            return false;
        }
    });

    return isFriend;
}


function sendSearchRequest(searchParam) {
    var dest = "/user/" + userData.username + "/search-friend";
    $.get(dest, {searchParam : searchParam}, function (response) {
        console.log(response);
        var friendResult = "<div class='card blue accent-3'>"
            + "<div class='card-content white-text'>"
            + "<span class='card-title'>" + response.username + "</span>"
            + "<p>First name: " + response.firstName + "</p>"
            + "<p>Last name: " + response.lastName + "</p></div>"
            + "<div class='card-action'><a id='send-friend-reqBtn'>Send friend request</a></div></div>";
        $("#search-result").off('click', "#send-friend-reqBtn");
        $("#search-result").append(friendResult).on("click", "#send-friend-reqBtn", response.username, sendFriendRequest);
    });
}
function sendFriendRequest(event) {
    var dest = "/user/" + userData.username + "/friend-request/" + event.data;
    restartSearchModal();
    $("#friends-search").closeModal();
    $.post(dest);
}

function restartSearchModal() {
    $("#search-result").empty();
    $('#search-input').val("");
    $('#searchBtn').addClass('disabled');
}

function restartLinkModal() {
    $("#link-URL").val("");
    $("#btnVideoLink").addClass('disabled');
}

function initVideoLinkButton() {
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


function logout() {
    if (player != null && messenger.PlayerID === userData.username) {
        var dest = "/user/" + userData.username + "/remove-player";
        messenger.sendUnsubscribeAllUsers()
                .then(function () {
                    $.post(dest, function (response) {
                        console.log("Server sent: " + response);
                        sendLogout();
                    });
                });
    }
    else {
       sendLogout();
    }
}

function sendLogout() {
    messenger.sendUserLogout(userData.friends);
    dest = "/logout";
    $.post(dest, {username : userData.username}, function (response) {
        window.location.href = response;
    });
}

function showUserFriends() {
    var friends = userData.friends;
    $("#user-friends").html("");
    $.each(friends, showFriend);

}

function showFriend(index, friend) {
    var li = "<li class='collection-item avatar z-depth-3' id='" + friend.username + "'>"
        + "<img src='" + findIconPathByIconName(friend.icon) + "' alt='user avatar' class='circle'>"
        + "<span class='title'>" + friend.username + "</span>"
        + "<p>" + friend.firstName + " " + friend.lastName + "</p>"
        + "<a id='add-" + friend.username + "' class='btn-floating waves-effect waves-light green disabled'><i class='material-icons'>" + "add" + "</i></a>";

    if(friend.loggedIn === true){
        li = li + "<a id='chatBtn-" + friend.username + "' class='btn-floating waves-effect waves-light blue'><i class='material-icons'>" + "voice_chat" + "</i></a>"
                + "<img class='online-sign secondary-content' src='/images/online.png' alt='online' class='circle'></li>";
    }
    else{
        li = li + "<a id='chatBtn-" + friend.username + "' class='btn-floating waves-effect waves-light blue disabled'><i class='material-icons'>" + "voice_chat" + "</i></a>"
                + "<img class='online-sign secondary-content' src='/images/offline.png' alt='online' class='circle'></li>";
    }

    $("#user-friends").append(li).on("click", "#add-" + friend.username, function () {
        messenger.sendInvite(friend.username);
    });

    $("#user-friends").on("click", "#chatBtn-" + friend.username, function () {
        disableFriendChatButton(friend.username);
        initRTCCall(friend.username);
    });
}

function enableAddFriendToWatchButton(){
    $.each(userData.friends, function(index, friend){
        if(friend.loggedIn === true){
            $("#add-" + friend.username).removeClass("disabled");
        }
    });
}

function findIconPathByIconName(iconName) {
    var iconPath;
    switch(iconName) {
        case "human":
            iconPath = "/images/icons/human-icon.png";
            break;
        case "bird":
            iconPath = "/images/icons/bird-icon.png";
            break;
        case "black-cat":
            iconPath = "/images/icons/black-cat-icon.png";
            break;
        case "cow":
            iconPath = "/images/icons/cow-icon.png";
            break;
        case "crab":
            iconPath = "/images/icons/crab-icon.png";
            break;
        case "dog":
            iconPath = "/images/icons/dog-icon.png";
            break;
        case "pig":
            iconPath = "/images/icons/pig-icon.png";
            break;
        case "sheep":
            iconPath = "/images/icons/sheep-icon.png";
            break;
        case "squid":
            iconPath = "/images/icons/squid-icon.png";
            break;
        case "turtle":
            iconPath = "/images/icons/turtle-icon.png";
            break;
        case "whale":
            iconPath = "/images/icons/whale-icon.png";
            break;
    }
    return iconPath;
}

function onUserSubscribedToPlayer(playerSyncData) {
    var username = playerSyncData.split(" ")[0];
    if (username !== userData.username) {
        toast(playerSyncData, 3000);
        $("#add-" + username).addClass("disabled");
    }
}

function updateUserLoginStatus(username, isLoggedIn) {
    //TODO: check if the user subscribed to player??? and delete him?
    $.each(userData.friends, function (index, friend) {
        if(friend.username === username){
            friend.loggedIn = isLoggedIn;

            if(isLoggedIn === true){
                $("#" + friend.username).find(".online-sign").attr("src","/images/online.png");
                if(peerConn === null || roomID === userData.username){
                    enableFriendChatButton(friend.username);
                }
                if(player !== null){
                    $("#add-" + friend.username).removeClass("disabled");
                }
            }
            else{
                $("#" + friend.username).find(".online-sign").attr("src","/images/offline.png");
                disableFriendChatButton(friend.username);
                $("#add-" + friend.username).addClass("disabled");
            }
        }
    })
}

function acceptJoinPlayerRequest(event) {
    var requestingUsername = event.data;
    var dest = "/user/" + requestingUsername + "/join";
    $.get(dest, function (src) {
        initializePlayer(requestingUsername, decodeURIComponent(src));
    });
}

function getUserFriendRequests() {
    var dest = "/user/" + userData.username + "/friend-requests-notifications";
    $.get(dest, function (response) {
        userData.friendRequests = response;
        updateFriendRequestModal();
    });
}

function updateFriendRequestModal() {
    var requests = userData.friendRequests;
    $(".badge").text(requests.length);
    $("#friend-requests-list").empty();

    $.each(requests, function (index, request) {
        var date = new Date(request.date);
        var li = "<li class='collection-item black-text row' id='request-" + request.requestingUsername + "'>"
            + "<div class='col s6 m6 l6'><h5 class='blue-text accent-3-text'>Username: " + request.requestingUsername + "</h5>"
            + "<p>" + request.message + "</p>"
            + "<p>Date: " + date.toLocaleString() + "</p></div>"
            + "<div class='col s6 m6 l6'><a id='decline-" + request.requestingUsername + "' class='btn waves-effect waves-light red right'><i class='material-icons'>" + "clear" + "</i></a>"
            + "<a id='accept-" + request.requestingUsername + "' class='btn waves-effect waves-light green right'><i class='material-icons'>" + "done" + "</i></a></div>";

        $("#friend-requests-list").append(li).on("click", "#decline-" + request.requestingUsername, function () {
            declineFriend(request.requestingUsername);
        }).on("click", "#accept-" + request.requestingUsername, function () {
            makeFriend(request.requestingUsername);
        });
    });

}

function makeFriend(requesting) {
    var dest = "/user/" + userData.username + "/make-friend/" + requesting;
    $.post(dest, function (response) {
        messenger.sendFriendRequestAccepted(requesting);
        getUserFriendRequests();
        addFriendToUser(requesting);
    });
}

function addFriendToUser(username) {
    var dest = "/user/" + username + "/user-data";
    $.get(dest, function (response) {
        userData.friends.push(response);
        showFriend({}, response);
    });
}

function declineFriend(requesting) {
    var dest = "/user/" + userData.username + "/decline-friend/" + requesting;
    $.post(dest, function (response) {
        getUserFriendRequests();
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
            toast(msg.username + " logged in", 2000);
            updateUserLoginStatus(msg.username, true);
            break;
        case "logout":
            console.log(msg.username + " logged out.");
            toast(msg.username + " logged out", 2000);
            updateUserLoginStatus(msg.username, false);
            break;
        case "invite":
            console.log(msg.username + " invited you to watch.");
            showJoinToPlayerModal(msg.username);
            break;
        case "acceptInvite":
            console.log(msg.username + " accepted your invitation to watch.");
            $("#add-" + msg.username).addClass("disabled");
            break;
        case "friendAccepted":
            console.log(msg.username + " accepted your friend request");
            toast(msg.username + " accepted your friend request", 2000);
            addFriendToUser(msg.username);
            break;
        case "RTCRoomID":
            console.log("RTC room id: " + msg.roomID.roomID);
            onReceiveRTCRoomID(msg.roomID.roomID, msg.roomID.username);
            break;
    }
}

function toast(msg, time) {
    Materialize.toast(msg, time, 'blue accent-3');
}

function showJoinToPlayerModal(username) {
    $("#joinplayer-accept-btn").click(username ,acceptJoinPlayerRequest);
    $("#joinplayer-text").html("").html(username + " invited you to watch a video together");
    $("#joinplayer-notification").openModal();
}

function onNewSrcChosen(src) {
    if (!playerExists()) {
        createPlayer(src);
    }
    else {
        updatePlayerSrc(src);
    }
}

function onUnsubscribeAllCallback() {
    messenger.unsubscribeFromPlayer();
    if (player.Type === 'youtube') {
        player.clearProgressBarInterval();
        clearVideoContainer();
    }
    else {
        clearVideoContainer();
    }

    player = null;
}

function clearVideoContainer() {
    $('#video-container').empty();
}

function onSrcChange(src) {
    if (WeviewYoutubePlayer.isYoutubeSrc(src)) {
        if(player.Type === 'html') {
            swtichPlayerFromHTMLToYoutube(src);
        }
        else if (player.Type === 'youtube'){
            player.changeSrc(src);
        }
    }
    else {
        if(player.Type === 'html') {
            player.changeSrc(src);
        }
        else if(player.Type === 'youtube') {
            swtichPlayerFromYoutubeToHTML(src);
        }
    }
}

function swtichPlayerFromHTMLToYoutube(src) {

    clearVideoContainer();
    if(youtubePlayer != null) {
        player = youtubePlayer;
        $("#video-container").append(youtubeIframe);
        player.onPlayerReady();
        player.changeSrc(src);
    }
    else {
        youtubePlayer = player = new WeviewYoutubePlayer.YoutubePlayer(src);
    }

    $('#video-controls').empty().append(videoControls);
    clearControlsEvents();
    initializeYouTubePlayerControls();
}

function swtichPlayerFromYoutubeToHTML(src) {
    player.clearProgressBarInterval();
    clearVideoContainer();
    player = new WeviewVideoPlayer.VideoPlayer(src);
    $('#video-controls').empty().append(videoControls);
    clearControlsEvents();
    player.initializeVideoEvents(onCanPlay);
    initializeVideoPlayerControls();
}

function clearControlsEvents() {
    $('#play-pause-button').off('click');
    $('#stop-button').off('click');
    $('#mute-button').off('click');
    $('#vol-inc-button').off('click');
    $('#vol-dec-button').off('click');
    $('#fullscreen').off('click');
    $('.progress-bar').off('mousedown');
    $(document).off('mouseup');
    $(document).off('mousemove');
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
            enableAddFriendToWatchButton();
            resolve(response);
        });
    });
}

function updatePlayerSrc(src) {
    messenger.updatePlayerSrc(src);
}

function initializePlayer(playerID, src) {
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
function loadInitialYoutubePlayer() {
    onNewSrcChosen(weviewYoutubeVideoLink);
}

function initializeYoutubePlayer(playerID, src) {
    youtubePlayer = player = new WeviewYoutubePlayer.YoutubePlayer(src);
    messenger.subscribeToPlayer(playerID, videoSubscriptionCallback);
    $('#video-container').empty().append(WeviewYoutubePlayer.youtubeTag);
    initializeYouTubePlayerControls();
}

function onYouTubeIframeAPIReady() {
    player.onYouTubeIframeAPIReady(onYouTubePlayerReady);
}

function onYouTubePlayerReady() {
    youtubeIframe = $('#video-container').html();
    // $('#video-container').attr("mozallowfullscreen");
    player.onPlayerReady();
}

function updateYouTubeProgressBar() {
    var duration = player.Player.getDuration();
    var currentTime = player.Player.getCurrentTime();
    setValuesToProgressBar(duration, currentTime);
}

function initializeYouTubePlayerControls() {
    // progressBar = $('#progress-bar');

    $('#play-pause-button').click(toggleYoutubePlay);
    $('#stop-button').click(onYoutubeStopPressed);
    $('#mute-button').click(toggleYoutubeMute);
    $('#vol-inc-button').click(onYoutubeVolumeUp);
    $('#vol-dec-button').click(onYoutubeVolumeDown);
    $('#fullscreen').click(function() {
        //TODO:not working
        // var youtube = $('#youtube-placeholder');
        if (youtubeIframe.requestFullscreen) {
            youtubeIframe.requestFullscreen();
        } else if (youtubeIframe.mozRequestFullScreen) {
            youtubeIframe.mozRequestFullScreen(); // Firefox
        } else if (youtubeIframe.webkitRequestFullscreen) {
            youtubeIframe.webkitRequestFullscreen(); // Chrome and Safari
        }
        return false;
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
    videoPlayer = player = new window.WeviewVideoPlayer.VideoPlayer(src);
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
        //player.Video.webkitEnterFullscreen();
        if (player.Video.requestFullscreen) {
            player.Video.requestFullscreen();
        } else if (player.Video.mozRequestFullScreen) {
            player.Video.mozRequestFullScreen(); // Firefox
        } else if (player.Video.webkitRequestFullscreen) {
            player.Video.webkitRequestFullscreen(); // Chrome and Safari
        }
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
    var dest = userData.username + "/is-dbxtoken";
    $.get(dest,function (response) {
        if(response === true) {
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
    });

    return;
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

    $('div#filenames').append(b).on("click", "#dbx-button" + index, function () {
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


//WRTC
////////////////////////////////////////////////////////////////////////////////
function disableFriendChatButton(username) {
    $('#chatBtn-' + username).addClass("disabled");
}

function enableFriendChatButton(username) {
    $('#chatBtn-' + username).removeClass("disabled");
}

function initRTCCall(username) {
    if (roomID === null) {
        initRTCConnection(username);
        roomID = getRoomID();
        peerConn.open(roomID);
    }
    else {
        messenger.sendRoomID(username, JSON.stringify({"username": userData.username, "roomID" : roomID}));
    }
}

function getRoomID() {
    var id;

    if (roomID === null) {
        id = userData.username;
    }
    return id;
}


function onReceiveRTCRoomID(newRoomID, username) {
    if(roomID === null){
        disableFriendChatButton(username);
        roomID = newRoomID;
        initRTCConnection();
        peerConn.join(roomID);
    }
}


function initRTCConnection(username) {
    peerConn = new RTCMultiConnection();

    peerConn.userid = userData.username;

    peerConn.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    peerConn.session = {
        audio: true,
        video: true
    };

    peerConn.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    };

    peerConn.onstream = function (event) {

        var video = event.mediaElement;
        video.style.width = '100%';
        video.style.height = '100%';
        video.controls = false;
        video.className += "video-chat";

        if(roomID !== userData.username){
            disableAllChatButtons();
        }

        if (event.type === "remote") {
            $("#chat-collection").append(prepareRemoteVideoChatCard(event.userid));
            $('#chatcard-' + event.userid)[0].appendChild(video);
        }
        else {
            if(roomID === userData.username){
                messenger.sendRoomID(username, JSON.stringify({"username": userData.username, "roomID" : roomID}));
            }
            $("#local-chat-container")[0].innerHTML = prepareLocalVideoChatCard(event.userid);
            $('#chatcard-' + event.userid)[0].appendChild(video);
            document.getElementById("exitChat").onclick = exitChat;
        }
    };

    peerConn.onstreamended = function(event) {
        var mediaElement = document.getElementById(event.streamid);
        if(mediaElement) {
            if(event.type === "local"){
                $("#local-chat-container").empty();
            }
            removeRemoteVideoChatCards(event);
            enableOnlineFriendsChatButtons();
            roomID = null;
        }
    };

    peerConn.onEntireSessionClosed = function(event) {
        peerConn.attachStreams.forEach(function(stream) {
            stream.stop();
        });
        if(peerConn.userid === event.userid) return;
        toast('Entire chat has been closed by: ' + event.userid, 3000);
    };

    peerConn.onUserStatusChanged = function (event) {
        if(event.status === "offline"){
            var username = event.userid;
            $("#chatlist-" + username).remove();
            if(peerConn.isInitiator){
                $.each(userData.friends, function (index, friend) {
                    if(friend.username === username){
                        if(friend.loggedIn){
                            enableFriendChatButton(username);
                        }
                    }
                });
            }
            toast(event.userid + ' has left the chat', 2000);
        }
    };
}

function removeRemoteVideoChatCards() {
    $(".remote-item").remove();
}

function exitChat() {
    this.disabled = true;
    if(peerConn.isInitiator){
        peerConn.closeEntireSession(function () {
            toast("Entire chat has been closed", 2000);
        });
    }
    else{
        peerConn.leave();
        peerConn.attachStreams.forEach(function(stream) {
            stream.stop();
        });
    }
}

function disableAllChatButtons() {
    $.each(userData.friends, function (index, friend) {
        disableFriendChatButton(friend.username);
    });
}

function enableOnlineFriendsChatButtons() {
    $.each(userData.friends, function (index, friend) {
        if(friend.loggedIn){
            enableFriendChatButton(friend.username);
        }
    });
}

function prepareLocalVideoChatCard(userid) {
    var exitBtn = "<div class='col s4 m4' id='exitChatDiv'><a id='exitChat' class='btn-floating waves-effect waves-light red right'>"
        + "<i class='material-icons'>exit_to_app</i></a></div>";
    var chat = "<div class='row'><p class='chat-title col s8 m8'>" + userid + "</p>" + exitBtn + "</div>"
        + "<div id='chatcard-" + userid + "'>"
        + "</div>";
    return chat;
}

function prepareRemoteVideoChatCard(userid) {
    var chat = "<li id='chatlist-" + userid + "' class='collection-item white-text blue accent-3 chat-collection remote-item'>"
        + "<p class='chat-title'>" + userid + "</p>"
        + "<div id='chatcard-" + userid + "'>"
        + "</div></li>";
    return chat;
}
//////////////////////////////////////////////////////////////////////////////////////////////////