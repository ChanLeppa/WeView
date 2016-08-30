window.WeviewSocketMessaging = (function(WeviewSocketMessaging, $, undefined)
{
    var SocketMessenger = function (i_Dest) {

        this.m_Socket = new SockJS(i_Dest);
        this.m_StompClient = Stomp.over(this.m_Socket);
        this.m_Subscription = null;

        this.connect = function () {
            this.m_StompClient.connect({}, function (frame) {
                console.log("Connected: " + frame);
            });
        };

        this.subscribe = function (i_Dest, i_Callback) {
            this.m_Subscription = this.m_StompClient.subscribe(i_Dest, i_Callback);
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
        get Subscription() { return this.m_Subscription; }
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