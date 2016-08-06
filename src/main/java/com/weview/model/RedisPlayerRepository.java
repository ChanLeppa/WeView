package com.weview.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Collection;
import java.util.Set;

@Component
public class RedisPlayerRepository implements PlayerRepository{

    private RedisTemplate<String, PlayerSubscriberData> redisTemplate;

    @Resource(name = "redisTemplate")
    private SetOperations<String, PlayerSubscriberData> setOps;

    @Autowired
    public RedisPlayerRepository(RedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void addPlayer(String playerId, PlayerSubscriberData data) {
        setOps.add(playerId, data);
    }

    @Override
    public void addPlayer(String playerID, PlayerSyncronizationData playerData) {

    }

    @Override
    public void removePlayer(String playerID) {

    }

    @Override
    public PlayerSyncronizationData getPlayerData(String playerID) {
        return null;
    }

    @Override
    public void addSubscriber(String playerID, PlayerSubscriberData subscriber) {

    }

    @Override
    public void removeSubscriber(String playerID, String subscriberID) {

    }

    @Override
    public Collection<PlayerSubscriberData> getSubscribers(String playerID) {
        return null;
    }

    @Override
    public PlayerSubscriberData getSubscriber(String playerID, String subscriberID) {
        return null;
    }

    @Override
    public Boolean allSubscribersCanPlay(String playerID) {
        Boolean allCanPlay = true;
        Set<PlayerSubscriberData> members = setOps.members(playerID);

        for (PlayerSubscriberData vsd : members) {
            if (!vsd.isCanPlay()) {
                allCanPlay = false;
                break;
            }
        }

        return allCanPlay;
    }
}