package com.weview.control;

import com.dropbox.core.DbxException;
import com.dropbox.core.DbxWebAuth;
import com.weview.model.player.PlayerCallback;
import com.weview.model.player.RedisUserPlayerRepository;
import com.weview.model.player.playerdb.PlayerSubscriberData;
import com.weview.model.player.playerdb.PlayerSynchronizationData;
import com.weview.model.dropbox.DropboxManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Controller
public class PlayerController {

    @Autowired
    private RedisUserPlayerRepository playerRepository;

    @RequestMapping(value = "/user/{username}", method = RequestMethod.GET)
    public String getPlayerPage() {
        return "/player.html";
    }

    @MessageMapping("/user/{username}/player/subscribe")
    @SendTo("/topic/{username}/player")
    public String subscribeToPlayer(@DestinationVariable String username, String subscriberUsername) throws Exception {

        playerRepository.addSubscriber(username, new PlayerSubscriberData(subscriberUsername));

        return "Subscribed to player " + username;
    }

    @MessageMapping("/user/{username}/player/unsubscribe")
    @SendTo("/topic/{username}/player")
    public String unsubscribeFromPlayer(@DestinationVariable String username, String subscriberUsername) throws Exception {

        playerRepository.removeSubscriber(username, subscriberUsername);

        return "Unsubscribed from player " + username;
    }

    @MessageMapping("/user/{username}/player/canplay")
    @SendTo("/topic/{username}/player")
    public String canPlay(@DestinationVariable String username, String subscriberUsername) throws Exception {

        playerRepository.updateSubscriberToCanPlay(username, subscriberUsername);

        return "CanPlay updated";
    }

    @MessageMapping("/user/{username}/player/play")
    @SendTo("/topic/{username}/player")
    public PlayerSynchronizationData play(@DestinationVariable String username) throws Exception {

        while (!playerRepository.allSubscribersCanPlay(username)) {}

        PlayerSynchronizationData updatedPsd = playerRepository.getPlayerData(username);
        updatedPsd.setState(PlayerCallback.PLAY);

        return updatedPsd;
    }

    @MessageMapping("/user/{username}/player/pause")
    @SendTo("/topic/{username}/player")
    public PlayerSynchronizationData pause(@DestinationVariable String username, PlayerSynchronizationData psd)
            throws Exception {

        playerRepository.updatePlayerTime(username, psd.getTime());
        PlayerSynchronizationData updatedPsd = playerRepository.getPlayerData(username);
        updatedPsd.setState(PlayerCallback.PAUSE);

        return updatedPsd;
    }

    @MessageMapping("/user/{username}/player/stop")
    @SendTo("/topic/{username}/player")
    public PlayerSynchronizationData stop(@DestinationVariable String username, PlayerSynchronizationData psd)
            throws Exception {

        playerRepository.updatePlayerTime(username, psd.getTime());
        PlayerSynchronizationData updatedPsd = playerRepository.getPlayerData(username);
        updatedPsd.setState(PlayerCallback.STOP);

        return updatedPsd;
    }

    @MessageMapping("/user/{username}/player/syncVideo")
    @SendTo("/topic/{username}/player")
    public PlayerSynchronizationData sync(@DestinationVariable String username, PlayerSynchronizationData psd)
            throws Exception{

        playerRepository.updatePlayerTime(username, psd.getTime());

        PlayerSynchronizationData updatedPsd = playerRepository.getPlayerData(username);
        updatedPsd.setState(PlayerCallback.SYNC);

        return updatedPsd;
    }
}