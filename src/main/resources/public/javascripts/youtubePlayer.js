window.WeviewYoutubePlayer = (function(Weview, $, undefined)
{
    var YoutubePlayer = function(i_YoutubeVideoUrl) {

        $.getScript("https://www.youtube.com/iframe_api");
        this.m_YoutubeVideoUrl = i_YoutubeVideoUrl;
        this.m_Player = null;
        this.m_UpdateBarInterval = null;

        this.onYouTubeIframeAPIReady = function (i_OnPlayerReady) {
            var videoId = this.getYoutubeVideoId(this.m_YoutubeVideoUrl);
            this.m_Player = new window.YT.Player('video-placeholder', {
                width: 990.16,
                height: 556.95,
                videoId: videoId,
                playerVars: {
                    'controls': 0,
                    'showinfo': 0,
                    'autohide': 1
                },
                events: {
                    'onReady': i_OnPlayerReady
                }
            });
        };

        this.onPlayerReady = function () {
            console.log("Youtube player ready!");
            onCanPlay();
            updateYouTubeProgressBar();

            if(this.m_UpdateBarInterval !== null){
                clearInterval(this.m_UpdateBarInterval);
            }

            this.m_UpdateBarInterval = setInterval(function () {
                updateYouTubeProgressBar();
            }, 100)
        };

        this.getYoutubeVideoId = function(i_URL) {
            var urlArray = i_URL.split("/");
            var lastElem = urlArray[urlArray.length - 1];
            if(lastElem.includes("v=")){
                urlArray = lastElem.split("=");
                lastElem = urlArray[urlArray.length - 1];
            }

            return lastElem;
        };

        this.doPause = function(){
            changeButtonType($('#play-pause-button'), 'play', 'pause', "<i class='tiny material-icons'>play_arrow</i>");
            this.m_Player.pauseVideo();
        };

        this.doPlay = function() {
            changeButtonType($('#play-pause-button'), 'pause', 'play', "<i class='tiny material-icons'>pause</i>");
            this.m_Player.playVideo();
        };

        this.doStop = function() {
            this.doPause();
            this.m_Player.seekTo(0);
            // this.updateYouTubeProgressBar();
        };


        this.subscriptionCallback = function(message, headers) {
            var playerSyncData = message.body;
            console.log("Server sent:" + message.body);
            if(playerSyncData.includes("subscribed to player")){
                onUserSubscribedToPlayer(playerSyncData);
            }
            if(playerSyncData !== "CanPlay updated")
            {
                playerSyncData = $.parseJSON(playerSyncData);

                switch(playerSyncData.callback) {
                    case "PLAY":
                        console.log(playerSyncData.message);
                        this.m_Player.seekTo(playerSyncData.time);
                        updateYouTubeProgressBar();
                        this.doPlay();
                        break;
                    case "STOP":
                        console.log(playerSyncData.message);
                        this.doStop();
                        break;
                    case "PAUSE":
                        console.log(playerSyncData.message);
                        this.doPause();
                        this.m_Player.seekTo(playerSyncData.time);
                        updateYouTubeProgressBar();
                        break;
                    case "SYNC":
                        console.log(playerSyncData.message);
                        this.m_Player.seekTo(playerSyncData.time);
                        updateYouTubeProgressBar();
                        break;
                    case "SRC":
                        this.doPause();
                        console.log(playerSyncData.message);
                        //TODO: notify of changed src
                        var newSrc = this.getYoutubeVideoId(playerSyncData.src);
                        this.m_Player.loadVideoById(newSrc);
                        break;
                    case "ERROR":
                        console.log(playerSyncData.message);
                        //TODO: Handle errors
                        break;
                }
            }
        };

        // this.sync = function(pageX){
        //     var currentTime = getUpdatedTime(pageX, this.m_Player.getDuration());
        //     // syncBean = {
        //     //     callBackName: "Sync",
        //     //     time : parseFloat(currentTime).toFixed(1),
        //     //     canPlay: true,
        //     //     playing: !video.paused
        //     // };
        //     // onSyncPressed(syncBean); //send to websocket
        //     player.seekTo(currentTime);
        //     updateProgressBar();
        // }


    };

    YoutubePlayer.prototype = {
        get Player() { return this.m_Player; },
        get YoutubeVideoUrl() { return this.m_YoutubeVideoUrl; }
    };

    function isYoutubeSrc(i_URL) {
        return i_URL.includes("https://youtu") || i_URL.includes("https://www.youtu");
    }


    return {
        YoutubePlayer: YoutubePlayer,
        isYoutubeSrc: isYoutubeSrc
    }

})(window.WeviewYoutubePlayer || {}, jQuery);




