package com.weview.control;

import com.weview.model.PlayerSubscriberData;
import com.weview.model.PlayerSynchronizationData;
import com.weview.model.RedisPlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.security.Principal;

@Controller
public class PlayerController {

    @Autowired
    private RedisPlayerRepository playerRepository;

    @RequestMapping(value = "/{id}/player", method = RequestMethod.GET)
    public String player(@PathVariable("id") String userID) {
        return "/player.html";
    }

    @MessageMapping("/{playerID}/subscribe")
    @SendTo("/topic/{playerID}/videoplayer")
    public String subscribeToPlayer(@DestinationVariable String playerID, Principal principal) throws Exception {

        playerRepository.addSubscriber(playerID, new PlayerSubscriberData(principal.getName()));

        return "Subscribed to player";
    }

    @MessageMapping("/{playerID}/canplay")
    @SendTo("/topic/{playerID}/videoplayer")
    public String canPlay(@DestinationVariable String playerID, Principal principal) throws Exception {

        String subscriberID = principal.getName();
        updateSubscriberSetCanPlay(playerID, subscriberID);

        return "CanPlay updated";
    }

    private void updateSubscriberSetCanPlay(String playerID, String subscriberID) {
        synchronized (this) {
            PlayerSubscriberData psd = playerRepository.getSubscriber(playerID, subscriberID);
            playerRepository.removeSubscriber(playerID, psd);
            psd.setCanPlay();
            playerRepository.addSubscriber(playerID, psd);
        }
    }

    @MessageMapping("/{playerID}/play")
    @SendTo("/topic/{playerID}/videoplayer")
    public String play(@DestinationVariable String playerID) throws Exception {

        while (!playerRepository.allSubscribersCanPlay(playerID)) {}

        return "Play";
    }

    @MessageMapping("/{playerID}/pause")
    @SendTo("/topic/{playerID}/videoplayer")
    public String pause() throws Exception {
        return "Pause";
    }

    @MessageMapping("/{playerID}/stop")
    @SendTo("/topic/{playerID}/videoplayer")
    public String stop() throws Exception {
        return "Stop";
    }

    @MessageMapping("/{playerID}/sync")
    @SendTo("/topic/{playerID}/videoplayer")
    public PlayerSynchronizationData sync(PlayerSynchronizationData playerSynchronizationData) throws Exception{
        return playerSynchronizationData;
    }
}