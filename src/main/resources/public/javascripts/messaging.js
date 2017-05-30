/**
 * This class manages all the messaging and connection to the server websocket endpoints
 * @type {{SocketMessenger}}
 */
window.WeviewSocketMessenger = (function(Weview, $, undefined)
{
    var SocketMessenger = function (i_Username) {

        this.k_DestUrlPrefix = '/app';
        this.k_SubscriptionUrlPrefix = '/topic';
        this.k_UserPrefix = '/user';
        this.k_CanPlayUrl = '/canplay';
        this.k_CannotPlayUrl = '/cannotplay';
        this.k_PlayUrl = '/play';
        this.k_PauseUrl = '/pause';
        this.k_StopUrl = '/stop';
        this.k_SyncUrl = '/sync';
        this.k_PlayerUrl = '/player';
        this.k_SubscribeUrl = '/subscribe';
        this.k_UnsubscribeUrl = '/unsubscribe';
        this.k_UnsubscribeAllUrl = '/unsubscribe-all-subscribers';
        this.k_FriendLoginUrl = '/friend-login';
        this.k_FriendLogoutUrl = '/friend-logout';
        this.k_InviteUrl = '/invite';
        this.k_AcceptInvite = '/accept';
        this.k_UpdateSrcUrl = '/update-src';
        this.k_FriendAccepted = '/friend-accepted';
        this.k_RTCPrefixUrl = '/rtc';
        this.k_RTCCandidateUrl = '/rtc-candidate';
        this.k_RTCOfferUrl = '/rtc-offer';
        this.k_RTCAnswerUrl = '/rts-answer';
        this.m_Username = i_Username;
        this.m_PlayerID = null;
        this.m_Socket = new SockJS('/connect');
        this.m_StompClient = Stomp.over(this.m_Socket);
        this.m_UserSubscription = null;
        this.m_PlayerSubscription = null;
        this.m_RTCRoomSubscription = null;

        this.connect = function () {
            var stompClient = this.m_StompClient;
            return new Promise(function (resolve, reject) {
                stompClient.connect({}, function (frame) {
                    console.log("Connected: " + frame);
                    resolve(frame);
                },
                function (error) {
                    reject(error);
                });
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
            var dest = this.k_SubscriptionUrlPrefix + this.k_UserPrefix + '/' + this.m_Username;
            this.m_UserSubscription = this.subscribe(dest, i_Callback);
            return this.m_UserSubscription;
        };

        this.unsubscribeFromUser = function () {
            this.unsubscribe(this.m_UserSubscription);
        };

        this.subscribeToPlayer = function (i_PlayerID, i_Callback) {
            this.m_PlayerID = i_PlayerID;
            var dest = this.k_SubscriptionUrlPrefix + this.k_UserPrefix + '/' + i_PlayerID + this.k_PlayerUrl;
            this.m_PlayerSubscription = this.subscribe(dest, i_Callback);
            this.subscribeToPlayerInDatabase();
            return this.m_PlayerSubscription;
        };

        this.subscribeToPlayerInDatabase = function () {
            var dest = this.getPlayerUrl() + this.k_SubscribeUrl;
            this.send(dest, this.m_Username);
        };

        this.unsubscribeFromPlayer = function () {
            var dest = this.getPlayerUrl() + this.k_UnsubscribeUrl;
            this.send(dest, this.m_Username);
            this.unsubscribe(this.m_PlayerSubscription);
            this.m_PlayerID = null;
        };

        this.subscribeToRTCRoom = function (i_RoomID, i_Callback) {
            var dest = this.k_SubscriptionUrlPrefix + this.k_RTCPrefixUrl + '/' + i_RoomID;
            this.m_RTCRoomSubscription = this.subscribe(dest, i_Callback);
        };

        this.sendUserLogin = function(i_Friends) {
            var destUrlPrefix = this.k_DestUrlPrefix;
            var userPrefix = this.k_UserPrefix;
            var friendLoginUrl = this.k_FriendLoginUrl;
            var username = this.m_Username;
            var stompClient = this.m_StompClient;
            $.each(i_Friends, function (i_Index, i_Friend) {
                if (i_Friend.loggedIn === true) {
                    var dest = destUrlPrefix + userPrefix + '/' + i_Friend.username + friendLoginUrl;
                    stompClient.send(dest, {}, username);
                }
            });
        };

        this.sendUserLogout = function (i_Friends) {
            var destUrlPrefix = this.k_DestUrlPrefix;
            var userPrefix = this.k_UserPrefix;
            var friendLogoutUrl = this.k_FriendLogoutUrl;
            var username = this.m_Username;
            var stompClient = this.m_StompClient;
            $.each(i_Friends, function (i_Index, i_Friend) {
                var dest = destUrlPrefix + userPrefix + '/' + i_Friend.username + friendLogoutUrl;
                stompClient.send(dest, {}, username);
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

        this.sendFriendRequestAccepted = function(i_Friend) {
            var dest = this.k_DestUrlPrefix + this.k_UserPrefix + '/' + i_Friend + this.k_FriendAccepted;
            this.send(dest, this.m_Username);
        };

        this.sendCanPlay = function () {
            var dest = this.getPlayerUrl() + this.k_CanPlayUrl;
            this.send(dest, this.m_Username);
        };

        this.sendCannotPlay = function () {
            var dest = this.getPlayerUrl() + this.k_CannotPlayUrl;
            this.send(dest, this.m_Username);
        };

        this.onPlayPressed = function (i_SyncData) {
            var dest = this.getPlayerUrl() + this.k_PlayUrl;
            var data = JSON.stringify(i_SyncData);
            this.send(dest, data);
        };

        this.onPausePressed = function (i_SyncData) {
            var dest = this.getPlayerUrl() + this.k_PauseUrl;
            var data = JSON.stringify(i_SyncData);
            this.send(dest, data);
        };

        this.onStopPressed = function (i_SyncData) {
            var dest = this.getPlayerUrl() + this.k_StopUrl;
            var data = JSON.stringify(i_SyncData);
            this.send(dest, data);
        };

        this.onSync = function (i_SyncData) {
            var dest = this.getPlayerUrl() + this.k_SyncUrl;
            var data = JSON.stringify(i_SyncData);
            this.send(dest, data);
        };

        this.updatePlayerSrc = function(i_Src) {
            var dest = this.getPlayerUrl() + this.k_UpdateSrcUrl;
            this.send(dest, i_Src);
        };

        this.getPlayerUrl = function() {
            return this.k_DestUrlPrefix + this.k_UserPrefix + '/' + this.m_PlayerID + this.k_PlayerUrl;
        };

        this.sendRTCCandidate = function (i_RoomID, i_Candidate) {
            var dest = this.k_DestUrlPrefix + this.k_RTCPrefixUrl + '/' + i_RoomID + '/' +this.k_RTCCandidateUrl;
            this.m_StompClient.send(dest, {}, i_Candidate);
        };

        this.sendRTCOffer = function(i_RoomID, i_Offer) {
            var dest = this.k_DestUrlPrefix + this.k_RTCPrefixUrl + '/' + i_RoomID + '/' + this.k_RTCOfferUrl;
            this.m_StompClient.send(dest, {}, i_Offer);
        };

        this.sendRTCAnswer = function (i_RoomID, i_Answer) {
            var dest = this.k_DestUrlPrefix + this.k_RTCPrefixUrl + '/' + i_RoomID + '/' + this.k_RTCAnswerUrl;
            this.m_StompClient.send(dest, {}, i_Answer);
        };

        this.sendRoomID = function (i_Username, i_RoomID) {
            var dest = this.k_DestUrlPrefix + this.k_UserPrefix + '/' + i_Username + this.k_RTCPrefixUrl;
            this.send(dest, i_RoomID);
        };

        this.sendUnsubscribeAllUsers = function () {
            var dest = this.getPlayerUrl() + this.k_UnsubscribeAllUrl;
            var stompClient = this.m_StompClient;
            return new Promise(function (resolve, reject) {
                stompClient.send(dest, {});
                resolve();
            });
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

})(window.WeviewSocketMessenger || {}, jQuery);