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
        return "{\"loginEvent\" : {\"friendLoggedin\" : \"" + loggingInFriendUsername + "\"}}";
    }

    @MessageMapping("/user/{username}/friend-logout")
    @SendTo("/topic/user/{username}")
    public String informOfLoggedOutUser(String loggingOutFriendUsername) {
        return "{\"logoutEvent\" : {\"friendLoggedOut\" : \"" + loggingOutFriendUsername + "\"}}";
    }

    @MessageMapping("/user/{username}/invite")
    @SendTo("/topic/user/{username}")
    public String inviteToWatch(String invitingUsername) {
        return "{\"inviteEvent\" : {\"invitingFriend\" : \"" + invitingUsername + "\"}}";
    }

    @MessageMapping("/user/{username}/accept")
    @SendTo("/topic/user/{username}")
    public String acceptInviteToWatch(String acceptingUsername) {
        return "{\"acceptInviteEvent\" : {\"acceptingFriend\" : \"" + acceptingUsername + "\"}}";
    }
}
