package com.weview.control;

import com.dropbox.core.DbxException;
import com.dropbox.core.DbxWebAuth;
import com.weview.model.PlayerSubscriberData;
import com.weview.model.PlayerSyncronizationData;
import com.weview.model.RedisPlayerRepository;
import com.weview.model.dropbox.DropboxManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import sun.invoke.empty.Empty;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Controller
public class PlayerController {
//    private WebSocketSessionHandler WSSH = WebSocketSessionHandler.getInstance();
    private DropboxManager dropbox = DropboxManager.getInstance();
    @Autowired
    private RedisPlayerRepository playerRepository;

    @RequestMapping(value = "/{playerID}/player", method = RequestMethod.GET)
    public String player(@PathVariable("playerID") String playerID, HttpServletRequest request, HttpServletResponse response) {
        return "/player.html";
    }

    @RequestMapping(value = "/{playerID}/filepath", method = RequestMethod.GET)
    public @ResponseBody List<String> getFilePathsDropbox(@PathVariable("playerID") String playerID) {
        List<String> pathFiles = new ArrayList<>();
        try {
            pathFiles =  dropbox.getListOfFilePaths(playerID, "");
        } catch (DbxException e) {
            e.printStackTrace();
        }
        return pathFiles;
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