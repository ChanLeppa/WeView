window.SocketMessaging = (function(SocketMessaging, $, undefined)
{
    var subscribeToPlayer = function() {
        var dest = '/app/' + playerID + '/subscribe';
        stompClient.send(dest);
    };

    var connect = function(subscribtionCallBack) {
        var socket = new SockJS('/connect');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            console.log("Connected: " + frame);
            var dest = '/topic/' + playerID + '/videoplayer';
            subscibtion = stompClient.subscribe(dest, subscribtionCallBack);
            subscribeToPlayer();
        });
    };

    var disconnect = function(){
        if(stompClient != null){
            stompClient.disconnect();
        }
        //do something after disconnecting
        console.log("Disconnected");
    };

    var oncanPlay = function() {
        var dest = '/app/' + playerID + '/canplay';
        stompClient.send(dest);
    };

    var onPlayPressed = function(){
        var dest = '/app/' + playerID + '/play';
        stompClient.send(dest);
    };

    var onPausePressed = function(){
        var dest = '/app/' + playerID + '/pause';
        stompClient.send(dest);
    };

    var onStopPressed = function(){
        var dest = '/app/' + playerID + '/stop';
        stompClient.send(dest);
    };

    var onSyncPressed = function(playerData) {
        var dest = '/app/' + playerID + '/sync';
        var data = JSON.stringify(playerData);
        stompClient.send(dest, {}, data);
    };

    return {
        connect: connect,
        disconnect: disconnect,
        onCanPlay: oncanPlay,
        onPlayPressed: onPlayPressed,
        onPausePressed: onPausePressed,
        onStopPressed: onStopPressed,
        onSyncPressed: onSyncPressed
    }

})(window.SocketMessaging || {}, jQuery);