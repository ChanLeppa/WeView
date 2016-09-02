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
var timeDrag = false;

var videoTag = "<video id='video' class='player row' preload='auto' width='100%' data-setup='{}'><p>Your browser does not support the video tag.</p></video>";
var videoContainer;
var playerID;
var username;
var playerControls;
//video.src = "https://dl.dropboxusercontent.com/u/5534803/Rick%20and%20Morty%20S01E01%20Pilot%20(1280x720)%20%5BPhr0stY%5D.mkv";

$(onLoad);

function onLoad() {
    // $(".dropdown-button").dropdown();
    // $(".modal-trigger").leanModal();
    // playerID = getPlayerID();
    // playerControls = $("#video-controls").html();
    // getActivePlayerSrc();
    // checkForAccessToken();
    //initDropBoxGetFileNames();
}


// function getPlayerID() {
//     var url = $(location).attr('href');
//     var splitURL = url.split("/");
//     return splitURL[splitURL.length - 2];
// }

// function getActivePlayerSrc() {
//     var playerIDSrc = replacePlayerToNameInURL("source");
//     $.get(playerIDSrc, function(response) {
//         if(!!response) {
//             disconnect();
//             connect();
//             var src = response.replace("src=", "");
//             src = decodeURIComponent(src);
//             initializePlayer(src);
//         }
//         else {
//             initVideoLinkButton();
//         }
//     });
// }

// function checkForAccessToken(){
//     var accessToken = replacePlayerToNameInURL("token");
//     $.get(accessToken, function(response) {
//         if(response === true) {
//             $('#reg-dropbox-button').remove();
//             $('#reg-dropbox-list').append("<a href='#dropbox-modal' id='choose-video-dropbox-button' class='modal-trigger light-blue-text text-accent-3'>Choose video to watch</a>");
//             $('.modal-trigger#choose-video-dropbox-button').leanModal();
//             $('#reg-dropbox-list').on("click", "#choose-video-dropbox-button", function() {
//                 getFileNames();
//             });
//         }
//         else {
//             initDropBoxSignInButton();
//         }
//     });
//
// }

// function replacePlayerToNameInURL(name) {
//     var url = $(location).attr('href');
//     return url.replace("player", name);
// }

//TODO:add link to video button on click
function initVideoLinkButton() {
    $('#btnVideoLink').click(function(){
        disconnect();
        connect();
        var videoSrc = $('#link-URL')[0].value;
        $('#link-URL').trigger('autoresize');
        $('#link-URL').val('');
        $('#link-URL').trigger('autoresize');
        initializePlayer(videoSrc);
        updateServerUserPlayer(videoSrc);
    });
}

// function initDropBoxSignInButton(){
//     $('#reg-dropbox-button').click(function(){
//         var uri = replacePlayerToNameInURL("dropbox");
//         $.get(uri, function(response) {
//             location.href = response;
//         });
//     })
// }
//
// function getFileNames(){
//     var uri = replacePlayerToNameInURL("filenames");
//     $.get(uri, function(response) {
//         $('div#filenames').html("");
//         $.each(response, addDropboxFilePathToHtml);
//     });
// }

// function addDropboxFilePathToHtml(index, fileName){
//     //first chaeck the video format...if it is video only then add to the page
//     var b = "<li class='collection-item'><div>" + fileName + "<a href='#' id='dbx-button" + index + "' class='secondary-content'><i class='material-icons blue-text text-accent-2'>send</i></a></div></li>";
//     $('div#filenames').append(b);
//     $('div#filenames').on("click", "#dbx-button" + index, function() {
//         var uri = replacePlayerToNameInURL("dbxlink");
//         $.get(uri, { fileName : fileName }, function(response) {
//             disconnect();
//             connect();
//             $('#dropbox-modal').closeModal();
//             initializePlayer(response);
//             updateServerUserPlayer(response);
//         });
//     });
// }

// function updateServerUserPlayer(videoSrc) {
//     var uri = replacePlayerToNameInURL("source");
//     $.post(uri, {src: videoSrc});
// }

// function initializePlayer(videoSource){
    // $('.video-placeholder').empty();
    // $('.video-placeholder').prepend(videoTag);
    // $('#video-controls').empty();
    // $('#video-controls').append(playerControls);
    // video = $('#video')[0];
    // videoControls = $('#video-controls')[0];

//     initializePlayerVideo(videoSource);
//     initializePlayerControls();
// }

// function initializePlayerVideo(videoSource) {
//     video.src = videoSource;
//     video.oncanplay = onCanPlay;
//     video.ontimeupdate = updateProgressBar;
//     video.onvolumechange = onVolumeChangeEvent;
//     video.onloadedmetadata = function() {
//         $('#duration').text(formatTime(video.duration));
//         $('#current').text(formatTime(0));
//     };
// }
//
// function initializePlayerControls() {
//     playPauseButton = $('#play-pause-button');
//     stopButton = $('#stop-button');
//     muteButton = $('#mute-button');
//     volumeinc = $('#vol-inc-button');
//     volumedec = $('#vol-dec-button');
//     progressBar = $('#progress-bar');
//
//     playPauseButton.click(togglePlay);
//     stopButton.click(onStopPressed);
//     muteButton.click(toggleMute);
//     $('#fullscreen').on('click', function() {
//         video.webkitEnterFullscreen();
//
//         return false;
//     });

    // $('#light-btn').on("click", function() {
    //     if($(this).hasClass('on')) {
    //         $(this).removeClass('on');
    //         $('body').append('<div class="overlay"></div>');
    //     }
    //     else {
    //         $(this).addClass('on');
    //         $('.overlay').remove();
    //     }
    //     return false;
    // });

//     $('.progress-bar').mousedown(function(e) {
//         timeDrag = true;
//         syncVideo(e.pageX);
//     });
//
//     $(document).mouseup(function(e) {
//         if(timeDrag) {
//             timeDrag = false;
//             syncVideo(e.pageX);
//         }
//     });
//
//     $(document).mousemove(function(e) {
//         if(timeDrag) {
//             syncVideo(e.pageX);
//         }
//     });
// }


// function onCanPlay(){
//     var dest = '/app/' + playerID + '/canplay';
//     stompClient.send(dest);
// }
//
// function onPlayPressed(event){
//     var dest = '/app/' + playerID + '/play';
//     stompClient.send(dest);
// }
//
// function onPausePressed(){
//     var dest = '/app/' + playerID + '/pause';
//     stompClient.send(dest);
// }
//
// function onStopPressed(){
//     var dest = '/app/' + playerID + '/stop';
//     stompClient.send(dest);
// }
//
// function onSyncPressed(syncBean) {
//     var dest = '/app/' + playerID + '/syncVideo';
//     var data = JSON.stringify(syncBean);
//     stompClient.send(dest, {}, data);
// }


// function syncVideo(pageX){
//     var currentTime = getUpdatedTime(pageX, video.duration);
//     syncBean = {
//         callBackName: "Sync",
//         time : parseFloat(currentTime).toFixed(1),
//         canPlay: true,
//         playing: !video.paused
//     };
//     onSyncPressed(syncBean);
// }

// function subscribtionCallBack(message, headers) {
//     console.log("Server sent:" + message.body);
//     if(message !== undefined){
//         if(message.body === "Play") {
//             doPlay();
//         }
//         else if(message.body === "Pause") {
//             doPause();
//         }
//         else if(message.body === "Stop"){
//             doPause();
//             video.currentTime = 0;
//             //progress-bar.value = 0;
//         }
//         else if(message.body !== undefined && message.body !== "CanPlay updated" && message.body !== "Subscribed to player") {
//             var syncBean = $.parseJSON(message.body);
//             if(syncBean.callBackName === "Sync")
//             {
//                 video.currentTime = syncBean.time;
//             }
//         }
//     }
// }

// function subscribeToPlayer() {
//     var dest = '/app/' + playerID + '/subscribe';
//     stompClient.send(dest);
// }

// function connect() {
//     var socket = new SockJS('/connect');
//     stompClient = Stomp.over(socket);
//     stompClient.connect({}, function (frame) {
//         console.log("Connected: " + frame);
//         var dest = '/topic/' + playerID + '/videoplayer';
//         subscibtion = stompClient.subscribe(dest, subscribtionCallBack);
//         subscribeToPlayer();
//     });
// }


// function disconnect(){
//     if(stompClient != null){
//         stompClient.disconnect();
//     }
//     //do something after disconnecting
//     console.log("Disconnected");
// }

//player controls
// function onVolumeChanged(direction){
//     var volume = video.volume;
//
//     if(direction === '+'){
//         video.volume += (volume === 1 ? 0 : 0.1);
//     }
//     else{
//         video.volume -= (volume === 0 ? 0 : 0.1);
//     }
//     // video.volume = parseFloat(video.volume).toFixed(1);
// }
//
// function toggleMute(){
//     if (video.muted){
//         changeButtonType(muteButton, 'mute', 'unmute', "<i class='tiny material-icons'>volume_mute</i>");
//         video.muted = false;
//     } else{
//         changeButtonType(muteButton, 'unmute', 'mute', "<i class='tiny material-icons'>volume_off</i>");
//         video.muted = true;
//     }
// }
//
// function togglePlay(){
//     if (video.paused){
//         onPlayPressed();
//     } else{
//         onPausePressed();
//     }
// }

// function changeButtonType(button, valueToSet, valueToChange, innerHtml){
//     button.html(innerHtml);
//     button.attr("type", valueToSet);
//     button.addClass(valueToSet).removeClass(valueToChange);
// }

// function updateProgressBar(){
//     var duration = video.duration;
//     var currentTime = video.currentTime;
//     setValuesToProgressBar(duration, currentTime);
// }
//
// function setValuesToProgressBar(duration, currentTime){
//     $('#current').text(formatTime(currentTime));
//     $('#duration').text(formatTime(duration));
//     var percentage = Math.floor((100 / duration) * currentTime);
//     $('#percentage').text(percentage);
//     $('.time-bar').css('width', percentage+'%');
// }

// function getUpdatedTime(x, duration) {
//         var progress = $('.progress-bar');
//         var maxduration = duration; //Video duraiton
//         var position = x - progress.offset().left; //Click pos
//         var percentage = 100 * position / progress.width();
//
//         //Check within range
//         if(percentage > 100) {
//             percentage = 100;
//         }
//         if(percentage < 0) {
//             percentage = 0;
//         }
//
//         return maxduration * percentage / 100;
// }

// function onVolumeChangeEvent() {
//     if (video.muted)
//         changeButtonType(muteButton, 'unmute', 'mute', "<i class='tiny material-icons'>volume_mute</i>");
//     else
//         changeButtonType(muteButton, 'mute', 'unmute', "<i class='tiny material-icons'>volume_off</i>");
// }

// function doPause(){
//     changeButtonType(playPauseButton, 'play', 'pause', "<i class='tiny material-icons'>play_arrow</i>");
//     video.pause();
// }
//
// function doPlay() {
//     changeButtonType(playPauseButton, 'pause', 'play', "<i class='tiny material-icons'>pause</i>");
//     video.play();
// }

// function formatTime(time){
//     time = Math.round(time);
//
//     var minutes = Math.floor(time / 60);
//     var seconds = time - minutes * 60;
//
//     seconds = seconds < 10 ? '0' + seconds : seconds;
//
//     return minutes + ":" + seconds;
// }
