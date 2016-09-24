package com.weview.model.player;

import java.io.Serializable;
import java.util.Date;

/**
 * This class represents a user that is subscribed to a specific player
 */
public class PlayerSubscriberData implements Serializable {

    private final String username;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        PlayerSubscriberData that = (PlayerSubscriberData) o;

        return username.equals(that.username);

    }

    @Override
    public int hashCode() {
        return username.hashCode();
    }
}