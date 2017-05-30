package com.weview.control;

import com.weview.control.exceptions.PlayerDuplicateException;
import com.weview.control.exceptions.PlayerNotExistsException;
import com.weview.model.player.RedisUserPlayerRepository;
import com.weview.model.player.PlayerSynchronizationData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * This class is the Http RESTFul control, it is in charge of all player
 * related Http endpoints
 */
@RestController
public class PlayerRestController {

    @Autowired
    RedisUserPlayerRepository userPlayerRepository;

    @RequestMapping(value = "/user/{username}/create-player", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public String createPlayer(@PathVariable("username") String username, @RequestBody String src) throws PlayerDuplicateException {

        if (userPlayerRepository.doesPlayerExist(username)) {
            throw new PlayerDuplicateException();
        }

        PlayerSynchronizationData psd = new PlayerSynchronizationData();
        psd.setSrc(src);

        userPlayerRepository.addPlayer(username, psd);

        return "Player created";
    }

    @RequestMapping(value = "/user/{usernameToJoin}/join", method = RequestMethod.GET)
    public String joinPlayer(@PathVariable("usernameToJoin") String usernameToJoin) {

        if (!userPlayerRepository.doesPlayerExist(usernameToJoin)) {
            throw new PlayerNotExistsException();
        }

        return userPlayerRepository.getPlayerData(usernameToJoin).getSrc();
    }

    @RequestMapping(value = "/user/{username}/remove-player", method = RequestMethod.POST)
    public String removePlayer(@PathVariable("username") String username) {

        userPlayerRepository.removePlayer(username);

        return username + "'s player has been removed";
    }

    @RequestMapping(value = "/user/{username}/does-player-exist", method = RequestMethod.GET)
    public Boolean doesPlayerExist(@PathVariable("username") String username) {

        return userPlayerRepository.doesPlayerExist(username);
    }

    @RequestMapping(value = "/user/{username}/get-player-data", method = RequestMethod.GET)
    public PlayerSynchronizationData getPlayerData(@PathVariable("username") String username)
            throws PlayerNotExistsException {

        if (!userPlayerRepository.doesPlayerExist(username)) {
            throw new PlayerNotExistsException();
        }

        return userPlayerRepository.getPlayerData(username);
    }
}
