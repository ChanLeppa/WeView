package com.weview.model;

import java.io.Serializable;
import java.util.Date;

public class PlayerSubscriberData implements Serializable{

    private final String username;
    private String playerID;
    private Boolean canPlay = false;
    private Date time = new Date();

    public PlayerSubscriberData(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public Boolean isCanPlay() {
        return canPlay;
    }

    public void setCanPlay() {
        this.canPlay = true;
    }

    public void setCannotPlay() {
        this.canPlay = false;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public Date getTime() {
        return time;
    }

    public String getPlayerID() {
        return playerID;
    }

    public void setPlayerID(String playerID) {
        this.playerID = playerID;
    }
}