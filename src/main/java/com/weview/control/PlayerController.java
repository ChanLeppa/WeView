package com.weview.control;

import com.weview.model.player.PlayerCallback;
import com.weview.model.player.RedisUserPlayerRepository;
import com.weview.model.player.playerdb.PlayerRepository;
import com.weview.model.player.playerdb.PlayerSubscriberData;
import com.weview.model.player.playerdb.PlayerSynchronizationData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class PlayerController {

    @Autowired
    private RedisUserPlayerRepository playerRepository;

    @RequestMapping(value = "/user/{username}", method = RequestMethod.GET)
    public String getPlayerPage() {
        return "/player.html";
    }

    @MessageMapping("/user/{username}/player/subscribe")
    @SendTo("/topic/user/{username}/player")
    public String subscribeToPlayer(@DestinationVariable String username, String subscriberUsername) throws Exception {

        playerRepository.addSubscriber(username, new PlayerSubscriberData(subscriberUsername));

        return "Subscribed to player " + username;
    }

    @MessageMapping("/user/{username}/player/unsubscribe")
    @SendTo("/topic/user/{username}/player")
    public String unsubscribeFromPlayer(@DestinationVariable String username, String subscriberUsername) throws Exception {

        playerRepository.removeSubscriber(username, subscriberUsername);

        return "Unsubscribed from player " + username;
    }

    @MessageMapping("/user/{username}/player/canplay")
    @SendTo("/topic/user/{username}/player")
    public String canPlay(@DestinationVariable String username, String subscriberUsername) throws Exception {

        playerRepository.updateSubscriberToCanPlay(username, subscriberUsername);

        return "CanPlay updated";
    }

    @MessageMapping("/user/{username}/player/play")
    @SendTo("/topic/user/{username}/player")
    public PlayerSynchronizationData play(@DestinationVariable String username, PlayerSynchronizationData psd) throws Exception {

        while (!playerRepository.allSubscribersCanPlay(username)) {}

        playerRepository.updatePlayerTime(username, psd.getTime());
        PlayerSynchronizationData updatedPsd = playerRepository.getPlayerData(username);
        updatedPsd.setCallback(PlayerCallback.PLAY);

        return updatedPsd;
    }

    @MessageMapping("/user/{username}/player/pause")
    @SendTo("/topic/user/{username}/player")
    public PlayerSynchronizationData pause(@DestinationVariable String username, PlayerSynchronizationData psd)
            throws Exception {

        playerRepository.updatePlayerTime(username, psd.getTime());
        PlayerSynchronizationData updatedPsd = playerRepository.getPlayerData(username);
        updatedPsd.setCallback(PlayerCallback.PAUSE);

        return updatedPsd;
    }

    @MessageMapping("/user/{username}/player/stop")
    @SendTo("/topic/user/{username}/player")
    public PlayerSynchronizationData stop(@DestinationVariable String username, PlayerSynchronizationData psd)
            throws Exception {

        playerRepository.updatePlayerTime(username, psd.getTime());
        PlayerSynchronizationData updatedPsd = playerRepository.getPlayerData(username);
        updatedPsd.setCallback(PlayerCallback.STOP);

        return updatedPsd;
    }

    @MessageMapping("/user/{username}/player/sync")
    @SendTo("/topic/user/{username}/player")
    public PlayerSynchronizationData sync(@DestinationVariable String username, PlayerSynchronizationData psd)
            throws Exception{

        playerRepository.updatePlayerTime(username, psd.getTime());

        PlayerSynchronizationData updatedPsd = playerRepository.getPlayerData(username);
        updatedPsd.setCallback(PlayerCallback.SYNC);

        return updatedPsd;
    }

    @MessageMapping("/user/{username}/player/update-src")
    @SendTo("/topic/user/{username}/player")
    public PlayerSynchronizationData updatePlayerSrc(@DestinationVariable String username, String src) {

        PlayerSynchronizationData psd;

        if (playerRepository.doesPlayerExist(username)) {
            playerRepository.updatePlayerSrc(username, src);
            psd = playerRepository.getPlayerData(username);
            psd.setCallback(PlayerCallback.SRC);
            //TODO: Add who changed the src in the message
        }
        else {
            psd = new PlayerSynchronizationData();
            psd.setCallback(PlayerCallback.ERROR);
            psd.setMessage("Error: unable to update video src, player " + username + " does not exist");
        }

        return psd;
    }

}