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

    private DropboxManager dropbox = DropboxManager.getInstance();

    @Autowired
    private RedisUserPlayerRepository playerRepository;

    @RequestMapping(value = "/user/{username}/player", method = RequestMethod.GET)
    public String getPlayerPage() {
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
            playerRepository.removeSubscriber(playerID, subscriberID);
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


    //Region DROPBOX===================================================================================================
    @RequestMapping(value = "/{playerID}/filenames", method = RequestMethod.GET)
    public @ResponseBody List<String> getFilePathsDropbox(@PathVariable("playerID") String playerID) {
        List<String> pathFiles = new ArrayList<>();
        try {
            pathFiles =  dropbox.getListOfFileNames(playerID, "");
        } catch (DbxException e) {
            e.printStackTrace();
        }
        return pathFiles;
    }

    @RequestMapping(value = "/{playerID}/token", method = RequestMethod.GET)
    public @ResponseBody Boolean checkForAccessToken(@PathVariable("playerID") String playerID) {
        return dropbox.checkAccessToken(playerID);
    }

    @RequestMapping(value = "/{playerID}/dbxlink", method = RequestMethod.GET)
    public @ResponseBody String getDropboxLinkToFile(@PathVariable("playerID") String playerID,
                                                     @RequestParam("fileName") String fileName) {
        return dropbox.getSourceLinkToFile(playerID, fileName);
    }

    @RequestMapping(value = "/dropbox-finish", method = RequestMethod.GET)
    public String redirectFromDropbox(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = "";

        try {
            accessToken = dropbox.getAccessToken(request.getSession(true),"dropbox-auth-csrf-token", request.getParameterMap());
        } catch (DbxWebAuth.NotApprovedException e) {
            e.printStackTrace();
        } catch (DbxWebAuth.BadRequestException e) {
            e.printStackTrace();
        } catch (DbxException e) {
            e.printStackTrace();
        } catch (DbxWebAuth.CsrfException e) {
            e.printStackTrace();
        } catch (DbxWebAuth.BadStateException e) {
            e.printStackTrace();
        } catch (DbxWebAuth.ProviderException e) {
            e.printStackTrace();
        }

        // save access token in user database
        String playerID = dropbox.getPlayerIdBySessionID(request.getSession().getId());
        dropbox.saveAccessToken(accessToken, playerID);
        // need to change the player.html so that the button "reg-dropbox-button" will not
        // show and there will be a list of users movies
        return "redirect:" + playerID + "/player";
    }
    //endregion
}