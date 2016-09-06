package com.weview.control;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;

import java.text.MessageFormat;

@Controller
public class UserWebSocketController {

    @MessageMapping("/user/{username}/friend-login")
    @SendTo("/topic/user/{username}")
    public String informOfLoggedInUser(String loggingInFriendUsername) {
        return "{\"event\" : \"login\", \"username\" : \"" + loggingInFriendUsername + "\"}";
    }

    @MessageMapping("/user/{username}/friend-logout")
    @SendTo("/topic/user/{username}")
    public String informOfLoggedOutUser(String loggingOutFriendUsername) {
        return "{\"event\" : \"logout\", \"username\" : \"" + loggingOutFriendUsername + "\"}";
    }

    @MessageMapping("/user/{username}/invite")
    @SendTo("/topic/user/{username}")
    public String inviteToWatch(String invitingUsername) {
        return "{\"event\" : \"invite\", \"username\" : \"" + invitingUsername + "\"}";
    }

    @MessageMapping("/user/{username}/accept")
    @SendTo("/topic/user/{username}")
    public String acceptInviteToWatch(String acceptingUsername) {
        return "{\"event\" : \"acceptInvite\", \"username\" : \"" + acceptingUsername + "\"}";
    }

    @MessageMapping("/rtc/{roomID}/rtc-candidate")
    @SendTo("/topic/rtc/{roomID}")
    public String signalRTCCandidate(String candidate) {
        return "{\"event\" : \"RTCCandidate\", \"candidate\" : " + candidate + "}";
    }

    @MessageMapping("/rtc/{roomID}/rtc-offer")
    @SendTo("/topic/rtc/{roomID}")
    public String signalRTCOffer(String offer) {
        return "{\"event\" : \"RTCOffer\", \"offer\" : " + offer + "}";
    }

    @MessageMapping("/rtc/{roomID}/rtc-answer")
    @SendTo("/topic/rtc/{roomID}")
    public String signalRTCAnswer(String answer) {
        return "{\"event\" : \"RTCAnswer\", \"answer\" : " + answer + "}";
    }

    @MessageMapping("/user/{username}/rtc")
    @SendTo("/topic/user/{username}")
    public String sendRoomID(String roomID) {
        return "{\"event\" : \"RTCRoomID\", \"roomID\" : " + roomID + "}";
    }


}
