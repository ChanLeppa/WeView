////////////////////////////////////////////////////////////////////////////////////////////////////
var stompClient = null;
var subscription;
var clientID;

var video;
var videoControls;
var playPauseButton;
var stopButton;
var muteButton;
var volumeinc;
var volumedec;
var progressBar;
var fullscreenButton;

var videoTag = '<video id="video" class="player"></video>';
var videoContainer;
var playerID;
var username;
//video.src = "https://dl.dropboxusercontent.com/u/5534803/Rick%20and%20Morty%20S01E01%20Pilot%20(1280x720)%20%5BPhr0stY%5D.mkv";

$(onLoad);

function onLoad() {
    videoContainer = $('#video-container').detach();
    playerID = getPlayerID();
    getActivePlayerSrc();
    initDropBoxSignInButton();
    initDropBoxGetFileNames();
}

function getPlayerID() {
    var url = $(location).attr('href');
    var splitURL = url.split("/");
    return splitURL[splitURL.length - 2];
}

function getActivePlayerSrc() {
    var playerIDSrc = replacePlayerToNameInURL("source");
    $.get(playerIDSrc, function(response) {
        if(!!response) {
            disconnect();
            connect();
            var src = response.replace("src=", "");
            src = decodeURIComponent(src);
            initializePlayer(src);
        }
        else {
            initVideoLinkButton();
        }
    });
}

function replacePlayerToNameInURL(name) {
    var url = $(location).attr('href');
    return url.replace("player", name);
}

function initVideoLinkButton() {
    $('#btnVideoLink').click(function(){
        disconnect();
        connect();
        var videoSrc = $('#link-URL')[0].value;
        initializePlayer(videoSrc);
        updateServerUserPlayer(videoSrc);
    });
}

function initDropBoxSignInButton(){
    $('#reg-dropbox-button').click(function(){
        var uri = replacePlayerToNameInURL("dropbox");
        $.get(uri, function(response) {
            location.href = response;
        });
    })
}

//To Change Later
function initDropBoxGetFileNames(){
    $('#dropbox-file-names').click(function(){
        var uri = replacePlayerToNameInURL("filenames");
        $.get(uri, function(response) {
            $('div#filenames').html("");
            $.each(response, addDropboxFilePathToHtml);
        });
    })
}

function addDropboxFilePathToHtml(index, fileName){
    var b = "<button id='dbx-button" + index + "' type='button'>" + fileName + "</button>";
    $('div#filenames').append(b);
    $('div#filenames').on("click", "#dbx-button" + index, function() {
        var uri = replacePlayerToNameInURL("dbxlink");
        $.get(uri, { fileName : fileName }, function(response) {
            $('#link-dbx').html("");
            $('#link-dbx').html(response);
        });
    });
}

// $("h2").on("click", "p.test", function(){
//     alert($(this).text());
// });
function updateServerUserPlayer(videoSrc) {
    var uri = replacePlayerToNameInURL("source");
    $.post(uri, {src: videoSrc});
}

function initializePlayer(videoSource){
    $('#videolink-container').append(videoContainer);
    $('#video-container').prepend(videoTag);
    video = $('#video')[0];
    videoControls = $('#video-controls')[0];

    initializePlayerVideo(videoSource);
    initializePlayerControls();
}

function initializePlayerVideo(videoSource) {
    video.src = videoSource;
    video.controls = false;
    video.oncanplay = onCanPlay;
    video.ontimeupdate = updateProgressBar;
    video.onvolumechange = onVolumeChangeEvent;
    video.onloadedmetadata = function() {
        $('#duration').text(video.duration.toFixed(1));
    };
}

function onVolumeChangeEvent() {
    if (video.muted)
        changeButtonType(muteButton, 'unmute', 'mute', "<span class='glyphicon glyphicon-volume-up'></span>");
    else
        changeButtonType(muteButton, 'mute', 'unmute',"<span class='glyphicon glyphicon-volume-off'></span>" );
}

function initializePlayerControls() {
    playPauseButton = $('#play-pause-button')[0];
    stopButton = $('#stop-button')[0];
    muteButton = $('#mute-button')[0];
    volumeinc = $('#vol-inc-button')[0];
    volumedec = $('#vol-dec-button')[0];
    progressBar = $('#progress-bar')[0];
    fullscreenButton = $('#fullscreen')[0];

    playPauseButton.onclick = togglePlay;
    stopButton.onclick = onStopPressed;
    muteButton.onclick = toggleMute;

    $('.progress')[0].onclick = function(e) {
        timeDrag = true;
        sync(e.pageX);
    };

    $(document).onmouseup = function(e) {
        if(timeDrag) {
            timeDrag = false;
            sync(e.pageX);
        }
    };

    $(document).onmousemove = function(e) {
        if(timeDrag) {
            sync(e.pageX);
        }
    };
}

function sync(pageX){
    var currentTime = updatebar(pageX);
    syncBean = {
        callBackName: "Sync",
        time : parseFloat(currentTime).toFixed(1),
        canPlay: true,
        playing: !video.paused
    };
    onSyncPressed(syncBean);
    //video.currentTime = currentTime; //to delete when done stompClient.send()
}

function onCanPlay(){
    var dest = '/app/' + playerID + '/canplay';
    stompClient.send(dest);
}

function onPlayPressed(){
    var dest = '/app/' + playerID + '/play';
    stompClient.send(dest);
}

function onPausePressed(){
    var dest = '/app/' + playerID + '/pause';
    stompClient.send(dest);
}

function onStopPressed(){
    var dest = '/app/' + playerID + '/stop';
    stompClient.send(dest);
}

function onSyncPressed(syncBean) {
    var dest = '/app/' + playerID + '/sync';
    var data = JSON.stringify(syncBean);
    stompClient.send(dest, {}, data);
}

function sync(pageX){
    var currentTime = updatebar(pageX);
    syncBean = {
        callBackName: "Sync",
        time : parseFloat(currentTime).toFixed(1),
        canPlay: true,
        playing: !video.paused
    };
    onSyncPressed(syncBean);
    //video.currentTime = currentTime; //to delete when done stompClient.send()
}

function subscribtionCallBack(message, headers) {
    console.log("Server sent:" + message.body);
    if(message !== undefined){
        if(message.body === "Play") {
            doPlay();
        }
        else if(message.body === "Pause") {
            doPause();
        }
        else if(message.body === "Stop"){
            doPause();
            video.currentTime = 0;
            progressBar.value = 0;
        }
        else if(message.body !== undefined) {
            var syncBean = $.parseJSON(message.body);
            if(syncBean.callBackName === "Sync")
            {
                video.currentTime = syncBean.time;
            }
        }
    }
}

function connect(){
    var socket = new SockJS('/connect');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function(frame){
        console.log("Connected: " + frame);
        var dest = '/topic/' + playerID + '/videoplayer';
        subscibtion = stompClient.subscribe(dest, subscribtionCallBack);
    });
}

function disconnect(){
    if(stompClient != null){
        stompClient.disconnect();
    }
    //do something after disconnecting
    console.log("Disconnected");
}

//player controls
function onVolumeChanged(direction){
    if(direction === '+'){
        video.volume += (video.volume == 1 ? 0 : 0.1);
    }
    else{
        video.volume -= (video.volume == 0 ? 0 : 0.1);
    }
    video.volume = parseFloat(video.volume).toFixed(1);
}

function toggleMute(){
    if (video.muted){
        changeButtonType(muteButton, 'mute', 'unmute', "<span class='glyphicon glyphicon-volume-off'></span>");
        video.muted = false;
    } else{
        changeButtonType(muteButton, 'unmute', 'mute', "<span class='glyphicon glyphicon-volume-up'></span>");
        video.muted = true;
    }
}

function togglePlay(){
    if (video.paused){
        onPlayPressed();
    } else{
        onPausePressed();
    }
}

function changeButtonType(button, valueToSet, valueToChange, innerHtml){
    button.innerHTML = innerHtml;
    button.setAttribute("type", valueToSet);
    button = $(button);
    button.addClass(valueToSet).removeClass(valueToChange);

}

function updateProgressBar(){
    $('#current').text(video.currentTime.toFixed(1));
    var percentage = Math.floor((100 / video.duration) * video.currentTime);
    $('#percentage').text(percentage);
    $(progressBar).width(percentage + "%");
}

function updatebar(x) {
    var maxduration = video.duration;
    var clickPosition = x - $(".progress")[0].offsetLeft //Click pos
    var percentage = 100 * clickPosition / $(".progress")[0].offsetWidth;

    //Check within range
    if(percentage > 100) {
        percentage = 100;
    }
    if(percentage < 0) {
        percentage = 0;
    }
    return (maxduration * percentage) / 100;
};

function doPause(){
    changeButtonType(playPauseButton, 'play', 'pause', "<span class='glyphicon glyphicon-play'></span>");
    video.pause();
}

function doPlay() {
    changeButtonType(playPauseButton, 'pause', 'play', "<span class='glyphicon glyphicon-pause'></span>");
    video.play();
}

function connect() {
    var socket = new SockJS('/connect');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log("Connected: " + frame);
        var dest = '/topic/' + playerID + '/videoplayer';
        subscibtion = stompClient.subscribe(dest, subscribtionCallBack);
        subscribeToPlayer();
    });
}

function onVolumeChangeEvent() {
    if (video.muted)
        changeButtonType(muteButton, 'unmute', 'mute', "<span class='glyphicon glyphicon-volume-up'></span>");
    else
        changeButtonType(muteButton, 'mute', 'unmute',"<span class='glyphicon glyphicon-volume-off'></span>" );
}

function subscribeToPlayer() {
    var dest = '/app/' + playerID + '/subscribe';
    stompClient.send(dest);
}

function playVideo() {
    video.play();
}

function pauseVideo() {
    video.pause();
}

function disconnect(){
    if(stompClient != null){
        stompClient.disconnect();
    }
    //do something after disconnecting
    console.log("Disconnected");
}










//var VideoSubscriberData = {
//    username : username,
//}