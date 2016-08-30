window.WeviewSocketMessaging = (function(WeviewSocketMessaging, $, undefined)
{
    var SocketMessenger = function (i_Username) {

        this.m_DestUrlPrefix = '/app/';
        this.m_CanPlayUrl = '/canplay';
        this.m_PlayUrl = '/play';
        this.m_PauseUrl = '/pause';
        this.m_StopUrl = '/stop';
        this.m_SyncUrl = '/sync';
        this.m_PlayerUrl = '/player';
        this.m_Username = i_Username;
        this.m_PlayerID = null;
        this.m_Socket = new SockJS('/connect');
        this.m_StompClient = Stomp.over(this.m_Socket);

        this.connect = function () {
            this.m_StompClient.connect({}, function (frame) {
                console.log("Connected: " + frame);
            });
        };

        this.subscribe = function (i_Dest, i_Callback) {
            return this.m_StompClient.subscribe(i_Dest, i_Callback);
        };

        this.disconnect = function () {
            if(this.m_StompClient != null){
                this.m_StompClient.disconnect();
            }

            console.log("Disconnected");
        };

        this.send = function(i_Dest, i_Data) {
            if ($.type(i_Data) === "undefined") {
                this.m_StompClient.send(i_Dest, i_Data);
            }
            else {
                this.m_StompClient.send(i_Dest, i_Data);
            }
        };
    };

    SocketMessenger.prototype = {
        get StompClient() { return this.m_StompClient; },
        get Username() { return this.m_Username; },
        set Username(i_Username) { this.m_Username = i_Username; },
        set PlayerID(i_PlayerID) { this.m_PlayerID = i_PlayerID; },
        get PlayerID() { return this.m_PlayerID; }
    };

    return {
        SocketMessenger: SocketMessenger
    }

})(window.WeviewSocketMessaging || {}, jQuery);



// window.SocketMessaging = (function(SocketMessaging, $, undefined)
// {
//     var subscribeToPlayer = function() {
//         var dest = '/app/' + playerID + '/subscribe';
//         stompClient.send(dest);
//     };
//
//     var connect = function(subscribtionCallBack) {
//         var socket = new SockJS('/connect');
//         stompClient = Stomp.over(socket);
//         stompClient.connect({}, function (frame) {
//             console.log("Connected: " + frame);
//             var dest = '/topic/' + playerID + '/videoplayer';
//             subscibtion = stompClient.subscribe(dest, subscribtionCallBack);
//             subscribeToPlayer();
//         });
//     };
//
//     var disconnect = function(){
//         if(stompClient != null){
//             stompClient.disconnect();
//         }
//         //do something after disconnecting
//         console.log("Disconnected");
//     };
//
//     var oncanPlay = function() {
//         var dest = '/app/' + playerID + '/canplay';
//         stompClient.send(dest);
//     };
//
//     var onPlayPressed = function(){
//         var dest = '/app/' + playerID + '/play';
//         stompClient.send(dest);
//     };
//
//     var onPausePressed = function(){
//         var dest = '/app/' + playerID + '/pause';
//         stompClient.send(dest);
//     };
//
//     var onStopPressed = function(){
//         var dest = '/app/' + playerID + '/stop';
//         stompClient.send(dest);
//     };
//
//     var onSyncPressed = function(playerData) {
//         var dest = '/app/' + playerID + '/sync';
//         var data = JSON.stringify(playerData);
//         stompClient.send(dest, {}, data);
//     };
//
//     return {
//         connect: connect,
//         disconnect: disconnect,
//         onCanPlay: oncanPlay,
//         onPlayPressed: onPlayPressed,
//         onPausePressed: onPausePressed,
//         onStopPressed: onStopPressed,
//         onSyncPressed: onSyncPressed
//     }
//
// })(window.SocketMessaging || {}, jQuery);