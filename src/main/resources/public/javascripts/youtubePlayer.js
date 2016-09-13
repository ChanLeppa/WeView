window.WeviewYoutubePlayer = (function(Weview, $, undefined)
{
    var youtubeTag = '<div id="youtube-placeholder" class="video-placeholder"></div>';

    var YoutubePlayer = function(i_YoutubeVideoUrl) {

        appendYoutubeTag();
        $.getScript("https://www.youtube.com/iframe_api");
        this.m_YoutubeVideoUrl = i_YoutubeVideoUrl;
        this.m_Player = null;
        this.m_UpdateBarInterval = null;
        this.m_Type = 'youtube';

        this.onYouTubeIframeAPIReady = function (i_OnPlayerReady) {
            var videoId = this.getYoutubeVideoId(this.m_YoutubeVideoUrl);
            this.m_Player = new window.YT.Player('youtube-placeholder', {
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

            setHeight('#youtube-placeholder');
        };

        this.onPlayerReady = function () {
            console.log("Youtube player ready!");
            sendCanPlay();
            updateYouTubeProgressBar();

            if(this.m_UpdateBarInterval !== null){
                clearInterval(this.m_UpdateBarInterval);
            }

            this.m_UpdateBarInterval = setInterval(function () {
                updateYouTubeProgressBar();
            }, 100)
        };

        this.clearProgressBarInterval = function() {
            clearInterval(this.m_UpdateBarInterval);
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

        this.changeSrc = function(i_Src) {
            // this.doPause();
            var newSrc = this.getYoutubeVideoId(i_Src);
            this.m_Player.loadVideoById(newSrc);
        };

        this.subscriptionCallback = function(message, headers) {
            var playerSyncData = message.body;
            console.log("Server sent:" + message.body);
            if(playerSyncData.includes("subscribed to player")){
                onUserSubscribedToPlayer(playerSyncData);
            }
            else if(playerSyncData.includes("unsubscribed from player")) {
                onUserUnsubscribedFromPlayer(playerSyncData);
            }
            else if (playerSyncData.includes("All unsubscribe from player ")) {
                onUnsubscribeAllCallback();
            }
            else if(playerSyncData !== "CannotPlay updated" && playerSyncData !== "CanPlay updated")
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
                        console.log(playerSyncData.message);
                        onSrcChange(playerSyncData.src);
                        break;
                    case "ERROR":
                        console.log(playerSyncData.message);
                        //TODO: Handle errors
                        break;
                }
            }
        };

        function appendYoutubeTag() {
            $('#video-container').empty().prepend(youtubeTag);
        }
    };

    YoutubePlayer.prototype = {
        get Player() { return this.m_Player; },
        get Type() { return this.m_Type; },
        get YoutubeVideoUrl() { return this.m_YoutubeVideoUrl; }
    };

    function isYoutubeSrc(i_URL) {
        return i_URL.includes("https://youtu") || i_URL.includes("https://www.youtu");
    }


    return {
        youtubeTag: youtubeTag,
        YoutubePlayer: YoutubePlayer,
        isYoutubeSrc: isYoutubeSrc
    }

})(window.WeviewYoutubePlayer || {}, jQuery);




