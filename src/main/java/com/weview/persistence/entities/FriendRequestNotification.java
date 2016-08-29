package com.weview.persistence.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import java.util.Date;

@Entity
public class FriendRequestNotification extends Notification {

    @Column
    private String requestingUsername;

    protected FriendRequestNotification() {
    }

    public FriendRequestNotification(String message, Date date, String requestingUsername) {
        super(message, date);
        this.requestingUsername = requestingUsername;
    }

    public String getRequestingUsername() {
        return requestingUsername;
    }
}
