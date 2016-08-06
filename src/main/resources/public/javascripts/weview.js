//$(function(){
//    //$.getScript("https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js");
//    //$.getScript("https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.1.1/sockjs.min.js");
//    //$.getScript("/javascripts/playerApp.js");
//});

window.WV = (function(WV, $, YT, undefined) {

    var URL;

    Player = function(i_URL) {
        var m_Player;

        this.m_URL = i_URL;
        m_Player = getVideoElement(i_URL);
    }

    Player.prototype = {
        set URL(i_URL) {
            this.m_URL = i_URL;
            URL = i_URL;
        },
        get URL() { return this.m_URL; },
    }

    function getVideoElement(i_URL) {

    }

    function isYoutubeVideo(i_URL) {
        return i_URL.includes("https://youtu");
    }

    function getYoutubeVideoId(i_URL) {
        var urlArray = i_URL.split("/");

        return urlArray[urlArray.length - 1];
    }

    function initYoutubeAPIScript() {
        var tag = document.createElement('script');
        tag.src = "http://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    function getPlayerID() {
        var url = $(location).attr('href');
        var splitURL = url.split("/");
        return splitURL[splitURL.length - 2];
    }

    function getActivePlayerSrc() {
        var playerIDSrc = replacePlayerToSourceURL();
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

    return {
        URL: URL,
        Player: Player,
        isYoutubeVideo: isYoutubeVideo,
        initYoutubeAPIScript: initYoutubeAPIScript
    }

})(window.WV || {}, jQuery, window.YT);