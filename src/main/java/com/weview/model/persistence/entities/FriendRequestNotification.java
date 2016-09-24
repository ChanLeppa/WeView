package com.weview.model.persistence.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import java.util.Date;

/**
 * This class is a derived class of the Notification JPA entity class,
 * it is used to persist the data of a friend request notification of
 * one user to another in the database
 */
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
