package com.weview.control;

import com.weview.control.exceptions.PlayerDuplicateException;
import com.weview.control.exceptions.PlayerNotExistsException;
import com.weview.model.player.RedisUserPlayerRepository;
import com.weview.model.player.playerdb.PlayerSynchronizationData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
public class PlayerRestController {

    @Autowired
    RedisUserPlayerRepository userPlayerRepository;

    @RequestMapping(value = "/user/{username}/create-player", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public String createPlayer(@PathVariable("username") String username, @RequestParam("src") String src) {

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
}
