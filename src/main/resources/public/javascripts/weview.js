//$(function(){
//    //$.getScript("https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js");
//    //$.getScript("https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.1.1/sockjs.min.js");
//    //$.getScript("/javascripts/playerApp.js");
//});

window.WV = (function(WV, $, undefined) {
    var URL;

    var Player = function (i_URL, i_YoutubePlayer) {

        this.m_IsYoutubePlayer = (i_YoutubePlayer) ? true : false;
        this.m_Player = initPlayer(i_URL, i_YoutubePlayer);
        this.m_Src = URL = i_URL;

        this.play = function () {
            if (this.m_IsYoutubePlayer) {
                this.m_Player.playVideo();
            }
            else {
                this.m_Player.play();
            }
        };

        this.pause = function () {
            if (this.m_IsYoutubePlayer) {
                this.m_Player.pauseVideo();
            }
            else {
                this.m_Player.pause();
            }
        };

        this.stop = function () {
            if (this.m_IsYoutubePlayer) {
                this.m_Player.stopVideo();
            }
            else {
                this.m_Player.stop();
            }
        };

        this.seekTo = function (i_Seconds) {
            var v_AllowSeekAhead = true;
            if (this.m_IsYoutubePlayer) {
                this.m_Player.seekTo(i_Seconds, v_AllowSeekAhead);
            }
            else {
                //HTML seek
            }
        };

        this.oncanplay = function(i_CallBack) {
            if (this.m_IsYoutubePlayer) {
                this.m_Player.addEventListener('onReady', i_CallBack);
            }
            else {
                this.m_Player.oncanplay = i_CallBack;
            }
        };

        this.ontimeupdate = function(i_CallBack) {
            if (this.m_IsYoutubePlayer) {
                //TODO:
            }
            else {
                this.m_Player.ontimeupdate = i_CallBack;
            }
        };

        this.onvolumechange = function(i_CallBack) {
            if (this.m_IsYoutubePlayer) {
                //TODO:
            }
            else {
                this.m_Player.onvolumechange = i_CallBack;
            }
        };

        this.onloadedmetadata = function(i_CallBack) {
            if (this.m_IsYoutubePlayer) {
                //TODO:
            }
            else {
                this.m_Player.onloadedmetadata = i_CallBack;
            }
        };

        this.mute = function() {
            if (this.m_IsYoutubePlayer) {
                this.m_Player.mute();
            }
            else {
                this.m_Player.muted = true;
            }
        };

        this.unMute = function() {
            if (this.m_IsYoutubePlayer) {
                this.m_Player.unMute();
            }
            else {
                this.m_Player.muted = false;
            }
        };

        this.onStateChange = function(i_CallBack) {
            if (this.m_IsYoutubePlayer) {
                this.m_Player.addEventListener('onStateChange', i_CallBack);
            }
        };
    };

    Player.prototype = {

        set Src(i_Src) {
            this.m_Src = i_Src;
            if(this.IsYoutubePlayer) {
                //TODO:
            }
            else {
                this.ActualPlayer.src = i_Src;
            }
        },
        get Src() { return this.m_Src; },

        get ActualPlayer() { return this.m_Player; },

        get IsYoutubePlayer() { return this.m_IsYoutubePlayer; },

        set Controls(i_IsSetControls) {
            if (this.IsYoutubePlayer) {
                this.m_Player.controls = i_IsSetControls ? 1 : 0;
            } else {
                this.m_Player.controls = i_IsSetControls;
            }
        },
        get Controls() { return this.m_Player.controls; },

        get Duration() { return this.m_Player.duration; },

        get Muted() { return this.m_IsYoutubePlayer ? this.m_Player.isMuted() : this.m_Player.muted; },

        get CurrentTime() { return this.m_Player.currentTime; },

        set Height(i_Height) { this.m_Player.height = i_Height; },
        get Height() { return this.m_Player.height; },

        set Width(i_Width) { this.m_Player.width = i_Width; },
        get Width() { return this.m_Player.width; },

        get IFrame() { return this.m_IsYoutubePlayer ? this.m_Player.getIframe() : $('#wv-video')[0]; }
    };

    var initPlayer = function (i_URL, i_YoutubePlayer) {
        return (i_YoutubePlayer) ? i_YoutubePlayer : getVideoElement(i_URL);
    };

    var getVideoElement = function (i_URL) {
        var player;
        player = getHTMLVideoElement(i_URL);

        return player;
    };

    var getHTMLVideoElement = function (i_URL) {
        var tag = $('#weview')[0];
        $(tag).after("<video id='wv-video'></video>");
        var video = $('#wv-video')[0];
        video.src = i_URL;
        video.controls = false;

        return video;
    };

    var getYoutubeVideoId = function (i_URL) {
        var urlArray = i_URL.split("/");

        return urlArray[urlArray.length - 1];
    };

    var isYoutubeSrc = function (i_URL) {
        return i_URL.includes("https://youtu");
    };

    return {
        URL: URL,
        Player: Player,
        isYoutubeSrc: isYoutubeSrc,
        getYoutubeVideoId: getYoutubeVideoId
    }
})(window.WV || {}, jQuery);