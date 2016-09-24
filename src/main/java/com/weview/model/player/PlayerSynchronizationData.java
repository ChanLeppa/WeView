package com.weview.model.player;

import java.io.Serializable;
import java.util.*;

/**
 * This class represents the player state in the player repository
 * and is used as the data-transfer-object to and from the client
 */
public class PlayerSynchronizationData implements Serializable {

    private String src;
    private PlayerCallback callback;
    private Double time = 0d;
    private String message;
    private Map<String, PlayerSubscriberData> subscribers = new HashMap<>();

    public String getSrc() {
        return src;
    }

    public void setSrc(String src) {
        this.src = src;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public PlayerCallback getCallback() {
        return callback;
    }

    public void setCallback(PlayerCallback callback) {
        this.callback = callback;
    }


    public Double getTime() {
        return time;
    }

    public void setTime(Double time) {
        this.time = time;
    }

    public Boolean isCanPlay() {
        Boolean canPlay = true;

        for (PlayerSubscriberData subscriber : subscribers.values()) {
            if (!subscriber.isCanPlay()) {
                canPlay = false;
                break;
            }
        }

        return canPlay;
    }

    public void addSubscriber(PlayerSubscriberData subscriber) {
        subscribers.put(subscriber.getUsername(), subscriber);
    }

    public void removeSubscriber(String subscriberId) {
        subscribers.remove(subscriberId);
    }

    public void updateSubscriber(PlayerSubscriberData subscriber) {
        if (isSubscriber(subscriber.getUsername())) {
            subscribers.remove(subscriber.getUsername());
        }

        subscribers.put(subscriber.getUsername(), subscriber);
    }

    public void clearSubscribers() {
        subscribers.clear();
    }

    public Boolean isSubscriber(String subscriberId) {
        return subscribers.containsKey(subscriberId);
    }

    public Collection<PlayerSubscriberData> getSubscribers() {
        return subscribers.values();
    }

    public PlayerSubscriberData getSubscriber(String subscriberId) {
        return subscribers.get(subscriberId);
    }

    public void updateSubsriberCanPlay(String subscriberId, Boolean canPlay) {
        if (canPlay) {
            subscribers.get(subscriberId).setCanPlay();
        }
        else {
            subscribers.get(subscriberId).setCannotPlay();
        }
    }
}
