package com.weview.control;

import com.weview.model.PlayerSubscriberData;
import com.weview.model.PlayerSyncronizationData;
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

//    private WebSocketSessionHandler WSSH = WebSocketSessionHandler.getInstance();

    @Autowired
    private RedisPlayerRepository playerRepository;

    @RequestMapping(value = "/{id}/player", method = RequestMethod.GET)
    public String player(@PathVariable("id") String userID) {
        return "/player.html";
    }

    @MessageMapping("/{playerID}/canplay")
    @SendTo("/topic/{playerID}/videoplayer")
    public String canPlay(@DestinationVariable String playerID, Principal principal) throws Exception {

//        WSSH.getSubscribers().get(principal.getName()).setCanPlay();

        playerRepository.addPlayer(playerID, new PlayerSubscriberData(principal.getName()));

        return "CanPlay updated";
    }

    @MessageMapping("/{playerID}/play")
    @SendTo("/topic/{playerID}/videoplayer")
    public String play(@DestinationVariable String playerID) throws Exception {

//        while (!WSSH.allSubscribersCanPlay()) {
//        }

        while (!playerRepository.allSubscribersCanPlay(playerID)) {
        }

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
    public PlayerSyncronizationData sync(PlayerSyncronizationData playerSynchronizationData) throws Exception{
        return playerSynchronizationData;
    }
}