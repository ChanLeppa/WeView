package com.weview.control;

import org.springframework.web.bind.annotation.*;

import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    private Integer guestUserNum = 0;
    private Map<Integer, String> userParams = new HashMap<>();

    @RequestMapping(value = "/guest", method = RequestMethod.GET)
    public String guest() {

        return MessageFormat.format("/{0}/player", generateGuestID());
    }

    @RequestMapping(value = "/{id}/source", method = RequestMethod.POST)
    public String postUserParameters(@PathVariable("id") String userID, @RequestBody String src) {

        Integer id = Integer.parseInt(userID);
        userParams.put(id, src);

        return userID;
    }

    @RequestMapping(value = "/{id}/source", method = RequestMethod.GET)
    public String getUserParameters(@PathVariable("id") String userID) {

        String src;
        Integer id = Integer.parseInt(userID);

        if (userParams.containsKey(id))
        {
            src = userParams.get(id);
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