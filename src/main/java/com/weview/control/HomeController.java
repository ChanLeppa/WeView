package com.weview.control;

import com.weview.model.player.playerdb.PlayerSynchronizationData;
import com.weview.utils.RandomIDGenerator;
import com.weview.model.player.RedisUserPlayerRepository;
import com.weview.model.dropbox.DropboxManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.text.MessageFormat;

@RestController
public class HomeController {

    @Autowired
    private RedisUserPlayerRepository playerRepository;
    private Integer guestUserNum = 0;
    private RandomIDGenerator randomIDGenerator = new RandomIDGenerator();


    @RequestMapping(value = "/guest", method = RequestMethod.GET)
    public String guest() {

        return MessageFormat.format("/{0}/player", generateGuestID());
    }

    @RequestMapping(value = "/{id}/source", method = RequestMethod.POST)
    public String postUserParameters(@PathVariable("id") String playerID,
                                     @RequestBody String src) {
        addPlayer(playerID, src);

        return src;
    }

    private void addPlayer(String playerID, String src) {
        PlayerSynchronizationData psd = new PlayerSynchronizationData();
        psd.setSrc(src);
        playerRepository.addPlayer(playerID, psd);
    }

//    private void addSubscriber(String playerID, String username) {
//        PlayerSubscriberData psd = new PlayerSubscriberData(username);
//        playerRepository.addSubscriber(playerID, psd);
//    }

    @RequestMapping(value = "/{id}/source", method = RequestMethod.GET)
    public String getUserParameters(@PathVariable("id") String playerID) {

        String src;
        String username = randomIDGenerator.generateID();

        if (playerRepository.doesPlayerExist(playerID))
        {
            src = playerRepository.getPlayerData(playerID).getSrc();
        }
        else
        {
            src = "";
        }

        return src;
    }

    private String generateGuestID() {
        return (++guestUserNum).toString();
    }
}

