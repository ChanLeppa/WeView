package com.weview.model.player.playerdb;

import com.sun.org.apache.xpath.internal.operations.Bool;
import com.weview.model.player.PlayerCallback;

import java.io.Serializable;
import java.util.*;

public class PlayerSynchronizationData implements Serializable {

    private String src;
    private PlayerCallback callback;
    private Double time;
    private Boolean playing;
    private Map<String, PlayerSubscriberData> subscribers = new HashMap<>();

    public String getSrc() {
        return src;
    }

    public PlayerCallback getState() {
        return callback;
    }

    public void setState(PlayerCallback state) {
        this.callback = state;
    }

    public void setSrc(String src) {
        this.src = src;
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

    public Boolean getPlaying() {
        return playing;
    }

    public void setPlaying(Boolean playing) {
        this.playing = playing;
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
