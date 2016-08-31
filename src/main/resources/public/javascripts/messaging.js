window.WeviewSocketMessaging = (function(WeviewSocketMessaging, $, undefined)
{
    var SocketMessenger = function (i_Username) {

        this.k_DestUrlPrefix = '/app';
        this.k_UserPrefix = '/user';
        this.k_CanPlayUrl = '/canplay';
        this.k_PlayUrl = '/play';
        this.k_PauseUrl = '/pause';
        this.k_StopUrl = '/stop';
        this.k_SyncUrl = '/sync';
        this.k_PlayerUrl = '/player';
        this.k_FriendLoginUrl = '/friend-login';
        this.k_FriendLogoutUrl = '/friend-logout';
        this.k_InviteUrl = '/invite';
        this.k_AcceptInvite = '/accept';
        this.m_Username = i_Username;
        this.m_PlayerID = null;
        this.m_Socket = new SockJS('/connect');
        this.m_StompClient = Stomp.over(this.m_Socket);
        this.m_UserSubscription = null;
        this.m_PlayerSubscription = null;

        this.connect = function () {
            this.m_StompClient.connect({}, function (frame) {
                console.log("Connected: " + frame);
            });
        };

        this.subscribe = function (i_Dest, i_Callback) {
            return this.m_StompClient.subscribe(i_Dest, i_Callback);
        };

        this.unsubscribe = function (i_Subscription) {
            i_Subscription.unsubscribe();
        };

        this.disconnect = function () {
            this.m_StompClient.disconnect();
            console.log("Disconnected");
        };

        this.send = function(i_Dest, i_Data) {
            if ($.type(i_Data) === "undefined") {
                this.m_StompClient.send(i_Dest);
            }
            else {
                this.m_StompClient.send(i_Dest, {}, i_Data);
            }
        };
        
        this.subscribeToUser = function (i_Callback) {
            var dest = this.k_DestUrlPrefix + this.k_UserPrefix + '/' + this.m_Username;
            this.m_UserSubscription = this.subscribe(dest, i_Callback);
            return this.m_UserSubscription;
        };

        this.unsubscribeFromUser = function () {
          this.unsubscribe(this.m_UserSubscription);
        };

        this.subscribeToPlayer = function (i_PlayerID, i_Callback) {
            this.m_PlayerID = i_PlayerID;
            var dest = this.k_DestUrlPrefix + this.k_UserPrefix + '/' + i_PlayerID + this.k_PlayerUrl;
            this.m_PlayerSubscription = this.subscribe(dset, i_Callback);
            return this.m_PlayerSubscription;
        };

        this.unsubscribeFromPlayer = function () {
            this.unsubscribe(this.m_PlayerSubscription);
        };

        this.sendUserLogin = function(i_Friends) {
            $.each(i_Friends, function (i_Index, i_Friend) {
                var dest = this.k_DestUrlPrefix + this.k_UserPrefix + '/' + i_Friend + this.k_FriendLoginUrl;
                this.send(dest, this.m_Username);
            })
        };

        this.sendUserLogout = function (i_Friends) {
            $.each(i_Friends, function (i_Index, i_Friend) {
                var dest = this.k_DestUrlPrefix + this.k_UserPrefix + '/' + i_Friend + this.k_FriendLogoutUrl;
                this.send(dest, this.m_Username);
            })
        };

        this.sendInvite = function(i_Friend) {
            var dest = this.k_DestUrlPrefix + this.k_UserPrefix + '/' + i_Friend + this.k_InviteUrl;
            this.send(dest, this.m_Username);
        };

        this.sendAcceptInvite = function(i_Friend) {
            var dest = this.k_DestUrlPrefix + this.k_UserPrefix + '/' + i_Friend + this.k_AcceptInvite;
            this.send(dest, this.m_Username);
        };

        this.onCanPlay = function () {
            var dest = getPlayerUrl() + this.k_CanPlayUrl;
            this.send(dest);
        };

        this.onPlayPressed = function (i_SyncData) {
            var dest = getPlayerUrl() + this.k_PlayUrl;
            var data = JSON.stringify(i_SyncData);
            this.send(dest, data);
        };

        this.onPausePressed = function (i_SyncData) {
            var dest = getPlayerUrl() + this.k_PauseUrl;
            var data = JSON.stringify(i_SyncData);
            this.send(dest, data);
        };

        this.onStopPressed = function (i_SyncData) {
            var dest = getPlayerUrl() + this.k_StopUrl;
            var data = JSON.stringify(i_SyncData);
            this.send(dest, data);
        };

        this.onSync = function (i_SyncData) {
            var dest = getPlayerUrl() + this.k_SyncUrl;
            var data = JSON.stringify(i_SyncData);
            this.send(dest, data);
        };

        function getPlayerUrl() {
            return this.k_DestUrlPrefix + this.k_UserPrefix + '/' + this.m_PlayerID + this.k_PlayerUrl;
        }
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