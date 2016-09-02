package com.weview.control;

import com.dropbox.core.DbxException;
import com.dropbox.core.DbxWebAuth;
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

    @MessageMapping("/user/{username}/player")
    @SendTo("/topic/{username}/player")
    public String subscribeToPlayer(@DestinationVariable String username, Principal principal) throws Exception {

        playerRepository.addSubscriber(username, new PlayerSubscriberData(principal.getName()));

        return "Subscribed to player";
    }

    @MessageMapping("/user/{username}/canplay")
    @SendTo("/topic/{username}/player")
    public String canPlay(@DestinationVariable String username, Principal principal) throws Exception {

        String subscriberID = principal.getName();
        updateSubscriberSetCanPlay(username, subscriberID);

        return "CanPlay updated";
    }

    private void updateSubscriberSetCanPlay(String playerID, String subscriberID) {
        synchronized (this) {
            PlayerSubscriberData psd = playerRepository.getSubscriber(playerID, subscriberID);
            playerRepository.removeSubscriber(playerID, subscriberID);
            psd.setCanPlay();
            playerRepository.addSubscriber(playerID, psd);
        }
    }

    @MessageMapping("/user/{username}/play")
    @SendTo("/topic/{username}/player")
    public String play(@DestinationVariable String username) throws Exception {

        while (!playerRepository.allSubscribersCanPlay(username)) {}

        return "Play";
    }

    @MessageMapping("/user/{username}/pause")
    @SendTo("/topic/{username}/player")
    public String pause() throws Exception {
        return "Pause";
    }

    @MessageMapping("/user/{username}/stop")
    @SendTo("/topic/{username}/player")
    public String stop() throws Exception {
        return "Stop";
    }

    @MessageMapping("/user/{username}/syncVideo")
    @SendTo("/topic/{username}/player")
    public PlayerSynchronizationData sync(PlayerSynchronizationData playerSynchronizationData) throws Exception{
        //TODO: Update player in repository
        return playerSynchronizationData;
    }
}