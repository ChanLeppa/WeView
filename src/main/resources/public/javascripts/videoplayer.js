window.WeviewVideoPlayer = (function(WeviewVideoPlayer, $, undefined)
{
    var videoTag = "<video id='video' class='player row' preload='auto' width='100%' data-setup='{}'><p>Your browser does not support the video tag.</p></video>";

    var VideoPlayer = function (i_Src) {
        this.m_Src = i_Src;
        this.timeDrag = false;
        appendVideoTag();
        this.m_Video = $("#video")[0];

        this.initializeVideoEvents = function(onCanPlay) {
            this.m_Video.src = this.m_Src;
            this.m_Video.oncanplay = onCanPlay;
            this.m_Video.ontimeupdate = this.updateProgressBar;
            this.m_Video.onvolumechange = this.onVolumeChangeEvent;
            this.m_Video.onloadedmetadata = this.onloadedmetadata;
        };
        
        this.subscriptionCallback = function (message, headers) {
            var playerSyncData = message.body;
            console.log("Server sent:" + message.body);
            // if(message !== undefined){
            //     if(message.body === "Play") {
            //         doPlay();
            //     }
            //     else if(message.body === "Pause") {
            //         doPause();
            //     }
            //     else if(message.body === "Stop"){
            //         doPause();
            //         video.currentTime = 0;
            //     }
            //     else if(message.body !== undefined && message.body !== "CanPlay updated" && message.body !== "Subscribed to player") {
            //         var syncBean = $.parseJSON(message.body);
            //         if(syncBean.callBackName === "Sync")
            //         {
            //             video.currentTime = syncBean.time;
            //         }
            //     }
            // }
        };

        this.onloadedmetadata = function() {
            $('#duration').text(formatTime(this.duration));
            $('#current').text(formatTime(0));
        }

        this.updateProgressBar = function(){
            var duration = this.duration;
            var currentTime = this.currentTime;
            setValuesToProgressBar(duration, currentTime);
        }

        this.onVolumeChangeEvent = function() {
            if (this.muted)
                changeButtonType($('#mute-button'), 'unmute', 'mute', "<i class='tiny material-icons'>volume_mute</i>");
            else
                changeButtonType($('#mute-button'), 'mute', 'unmute', "<i class='tiny material-icons'>volume_off</i>");
        }

        function setValuesToProgressBar(duration, currentTime){
            $('#current').text(formatTime(currentTime));
            $('#duration').text(formatTime(duration));
            var percentage = Math.floor((100 / duration) * currentTime);
            $('#percentage').text(percentage);
            $('.time-bar').css('width', percentage+'%');
        }

        function doPause(){
            changeButtonType($('#play-pause-button'), 'play', 'pause', "<i class='tiny material-icons'>play_arrow</i>");
            this.m_Video.pause();
        }

        function doPlay() {
            changeButtonType($('#play-pause-button'), 'pause', 'play', "<i class='tiny material-icons'>pause</i>");
            this.m_Video.play();
        }

        function appendVideoTag() {
            $('.video-placeholder').empty().prepend(videoTag);
        }
    };



    //same as youtube player
    ////////////////////////////////////////////
    function formatTime(time){
        time = Math.round(time);

        var minutes = Math.floor(time / 60);
        var seconds = time - minutes * 60;

        seconds = seconds < 10 ? '0' + seconds : seconds;

        return minutes + ":" + seconds;
    }
    /////////////////////////////////////////////////

    VideoPlayer.prototype = {
        get Src(){ return this.m_Src; },
        set Src(i_Src){ this.m_Src = i_Src; },
        get video(){ return this.m_Video }
    };

    return {
        videoTag: videoTag,
        VideoPlayer: VideoPlayer
    }

})(window.WeviewVideoPlayer || {}, jQuery);