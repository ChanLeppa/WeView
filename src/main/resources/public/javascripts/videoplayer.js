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
            if(playerSyncData !== "CanPlay updated" && !playerSyncData.includes("Subscribed to player"))
            {
                playerSyncData = $.parseJSON(playerSyncData);

                switch(playerSyncData.callback) {
                    case "PLAY":
                        console.log(playerSyncData.message);
                        this.m_Video.currentTime = playerSyncData.time;
                        this.doPlay();
                        break;
                    case "STOP":
                        console.log(playerSyncData.message);
                        this.doPause();
                        this.m_Video.currentTime = 0;
                        break;
                    case "PAUSE":
                        console.log(playerSyncData.message);
                        this.doPause();
                        this.m_Video.currentTime = playerSyncData.time;
                        break;
                    case "SYNC":
                        console.log(playerSyncData.message);
                        this.m_Video.currentTime = playerSyncData.time;
                        break;
                    case "SRC":
                        this.doPause();
                        console.log(playerSyncData.message);
                        //TODO: notify of changed src
                        this.m_Video.src = playerSyncData.src;
                        break;
                    case "ERROR":
                        console.log(playerSyncData.message);
                        //TODO: Handle errors
                        break;
                }
            }
        };

        this.onloadedmetadata = function() {
            $('#duration').text(formatTime(this.duration));
            $('#current').text(formatTime(0));
        };

        this.updateProgressBar = function(){
            var duration = this.duration;
            var currentTime = this.currentTime;
            setValuesToProgressBar(duration, currentTime);
        };

        this.onVolumeChangeEvent = function() {
            if (this.muted)
                changeButtonType($('#mute-button'), 'unmute', 'mute', "<i class='tiny material-icons'>volume_mute</i>");
            else
                changeButtonType($('#mute-button'), 'mute', 'unmute', "<i class='tiny material-icons'>volume_off</i>");
        };

        this.doPause = function(){
            changeButtonType($('#play-pause-button'), 'play', 'pause', "<i class='tiny material-icons'>play_arrow</i>");
            this.m_Video.pause();
        };

        this.doPlay = function() {
            changeButtonType($('#play-pause-button'), 'pause', 'play', "<i class='tiny material-icons'>pause</i>");
            this.m_Video.play();
        };

        function appendVideoTag() {
            $('.video-placeholder').empty().prepend(videoTag);
        }
    };

    VideoPlayer.prototype = {
        get Src(){ return this.m_Src; },
        set Src(i_Src){ this.m_Src = i_Src; },
        get Video(){ return this.m_Video }
    };

    return {
        videoTag: videoTag,
        VideoPlayer: VideoPlayer
    }

})(window.WeviewVideoPlayer || {}, jQuery);