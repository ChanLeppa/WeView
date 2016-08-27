var player;
var playPauseButton;
var stopButton;
var muteButton;
var volumeinc;
var volumedec;
var progressBar;
var fullscreenButton;
var timeDrag = false;
var updateBarInterval;

////////////////////////////////////////////
var playerID = getPlayerID();
var stompClient;
function getPlayerID() {
    var url = $(location).attr('href');
    var splitURL = url.split("/");
    return splitURL[splitURL.length - 2];
}
////////////////////////////////////////////

function onYouTubeIframeAPIReady() {

    //to recieve the link to a youtube movie
    player = new YT.Player('youtube-placeholder', {
        width: 990.16,
        height: 556.95,
        videoId: 'RG0wzAPYO7c',
        playerVars: {
            'controls': 0,
            'showinfo': 0,
            'autohide': 1
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady() {
    initializePlayerControls();
    updateProgressBar();

    clearInterval(updateBarInterval);

    updateBarInterval = setInterval(function () {
        updateProgressBar();
    }, 100)
}

function getYoutubeVideoId(i_URL) {
    var urlArray = i_URL.split("/");

    return urlArray[urlArray.length - 1];
}

function isYoutubeSrc(i_URL) {
    return i_URL.includes("https://youtu");
}

// function initializePlayerVideo(videoSource) {
//     video.src = videoSource;
//     //video.controls = false;
//     video.oncanplay = onCanPlay;
//     video.ontimeupdate = updateProgressBar;
//     video.onvolumechange = onVolumeChangeEvent;
//     video.onloadedmetadata = function() {
//         $('#duration').text(video.duration.toFixed(1));
//     };
// }

function initializePlayerControls() {
    playPauseButton = $('#play-pause-button');
    stopButton = $('#stop-button');
    muteButton = $('#mute-button');
    volumeinc = $('#vol-inc-button');
    volumedec = $('#vol-dec-button');
    progressBar = $('#progress-bar');
    fullscreenButton = $('#fullscreen');

    playPauseButton.click(togglePlay);
    stopButton.click(doStop);
    muteButton.click(toggleMute);
    fullscreenButton.click(function() {
        var iframe = $('#youtube-placeholder');
        iframe.webkitEnterFullscreen();
        // var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
        // if (requestFullScreen) {
        //     requestFullScreen.bind(iframe)();
        // }
    });

    $('.progress-bar').mousedown(function(e) {
        timeDrag = true;
        sync(e.pageX);
    });

    $(document).mouseup(function(e) {
        if(timeDrag) {
            timeDrag = false;
            sync(e.pageX);
        }
    });

    $(document).mousemove(function(e) {
        if(timeDrag) {
            sync(e.pageX);
        }
    });
}

function doPause(){
    changeButtonType(playPauseButton, 'play', 'pause', "<i class='tiny material-icons'>play_arrow</i>");
    player.pauseVideo();
}

function doPlay() {
    changeButtonType(playPauseButton, 'pause', 'play', "<i class='tiny material-icons'>pause</i>");
    player.playVideo();
}

function doStop() {
    doPause();
    player.seekTo(0);
}


function changeButtonType(button, valueToSet, valueToChange, innerHtml){
    button.html(innerHtml);
    button.attr("type", valueToSet);
    button.addClass(valueToSet).removeClass(valueToChange);
}

function onVolumeChanged(direction){
    var volume = player.getVolume();
    if(direction === '+'){
        player.setVolume(volume === 100 ? 100 : (volume + 5));
    }
    else{
        player.setVolume(volume === 0 ? 0 : (volume - 5));
    }
}

function toggleMute(){
    if (player.isMuted()){
        player.unMute();
        changeButtonType(muteButton, 'unmute', 'mute', "<i class='tiny material-icons'>volume_off</i>");
    } else{
        player.mute();
        changeButtonType(muteButton, 'mute', 'unmute', "<i class='tiny material-icons'>volume_mute</i>");
    }
}

function togglePlay(){
    if (player.getPlayerState() !== YT.PlayerState.PLAYING){
        // onPlayPressed();
        doPlay();
    } else{
        // onPausePressed();
        doPause();
    }
}
function sync(pageX){
    var currentTime = getUpdatedTime(pageX, player.getDuration());
    // syncBean = {
    //     callBackName: "Sync",
    //     time : parseFloat(currentTime).toFixed(1),
    //     canPlay: true,
    //     playing: !video.paused
    // };
    // onSyncPressed(syncBean); //send to websocket
    player.seekTo(currentTime);
    updateProgressBar();
}

// function onSyncPressed(syncBean) {
//     var dest = '/app/' + playerID + '/sync';
//     var data = JSON.stringify(syncBean);
//     stompClient.send(dest, {}, data);
// }

function updateProgressBar() {
    var duration = player.getDuration();
    var currentTime = player.getCurrentTime();
    setValuesToProgressBar(duration, currentTime);
}

function setValuesToProgressBar(duration, currentTime) {
    $('#current').text(formatTime(currentTime));
    $('#duration').text(formatTime(duration));
    var percentage = Math.floor((100 / duration) * currentTime);
    $('#percentage').text(percentage);
    $('.time-bar').css('width', percentage+'%');
}

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

function formatTime(time){
    time = Math.round(time);

    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    return minutes + ":" + seconds;
}