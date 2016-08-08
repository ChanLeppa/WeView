package com.weview.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.text.MessageFormat;
import java.util.Collection;
import java.util.Set;

@Component
public class RedisPlayerRepository implements PlayerRepository{

    private RedisTemplate<String, Object> redisTemplate;

    @Resource(name = "redisTemplate")
    private SetOperations<String, PlayerSubscriberData> setOpsSubscribers;

    @Resource(name = "redisTemplate")
    private ValueOperations<String, PlayerSynchronizationData> setOpsSyncData;

    @Autowired
    public RedisPlayerRepository(RedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void addPlayer(String playerID, PlayerSynchronizationData playerData) {
        setOpsSyncData.set(playerID, playerData);
    }

    @Override
    public void removePlayer(String playerID) {
        redisTemplate.delete(playerID);
    }

    @Override
    public PlayerSynchronizationData getPlayerData(String playerID) {
        return setOpsSyncData.get(playerID);
    }

    @Override
    public void addSubscriber(String playerID, PlayerSubscriberData subscriber) {
        setOpsSubscribers.add(getPlayerSubscriberKey(playerID), subscriber);
    }

    @Override
    public void removeSubscriber(String playerID, PlayerSubscriberData subscriber) {
        setOpsSubscribers.remove(getPlayerSubscriberKey(playerID), subscriber);
    }

    @Override
    public Collection<PlayerSubscriberData> getSubscribers(String playerID) {
        return setOpsSubscribers.members(getPlayerSubscriberKey(playerID));
    }

    @Override
    public PlayerSubscriberData getSubscriber(String playerID, String subscriberID) {
        PlayerSubscriberData subscriber = null;
        Set<PlayerSubscriberData> members = setOpsSubscribers.members(getPlayerSubscriberKey(playerID));

        for (PlayerSubscriberData s: members) {
            if (s.getUsername().equals(subscriberID)) {
                subscriber = s;
                break;
            }
        }

        return subscriber;
    }

    @Override
    public Boolean allSubscribersCanPlay(String playerID) {
        Boolean allCanPlay = true;
        Set<PlayerSubscriberData> members = setOpsSubscribers.members(getPlayerSubscriberKey(playerID));

        for (PlayerSubscriberData vsd : members) {
            if (!vsd.isCanPlay()) {
                allCanPlay = false;
                break;
            }
        }

        return allCanPlay;
    }

    @Override
    public Boolean doesPlayerExist(String playerID) {
        return redisTemplate.hasKey(playerID);
    }

    @Override
    public Boolean isSubscriber(String playerID, String subscriberID) {
        return setOpsSubscribers.isMember(playerID, subscriberID);
    }

    private String getPlayerSubscriberKey(String playerID) {
        return MessageFormat.format("{0}sub", playerID);
    }
}