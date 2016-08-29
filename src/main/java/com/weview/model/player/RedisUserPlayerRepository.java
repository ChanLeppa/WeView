package com.weview.model.player;

import com.weview.model.player.playerdb.PlayerRepository;
import com.weview.model.player.playerdb.PlayerSubscriberData;
import com.weview.model.player.playerdb.PlayerSynchronizationData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Collection;

@Component
public class RedisUserPlayerRepository implements PlayerRepository {

    private final String keyForUserPlayers = "USER_PLAYERS";

    private RedisTemplate<String, Object> redisTemplate;

    @Resource(name = "redisTemplate")
    private HashOperations<String, String, PlayerSynchronizationData> hashOperations;

    @Autowired
    public RedisUserPlayerRepository(RedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public synchronized void addPlayer(String playerId, PlayerSynchronizationData playerData) {
        hashOperations.put(keyForUserPlayers, playerId, playerData);
    }

    @Override
    public synchronized void removePlayer(String playerId) {
        hashOperations.delete(keyForUserPlayers, playerId);
    }

    @Override
    public synchronized PlayerSynchronizationData getPlayerData(String playerId) {
        return hashOperations.get(keyForUserPlayers, playerId);
    }

    @Override
    public synchronized void addSubscriber(String playerID, PlayerSubscriberData subscriber) {
        PlayerSynchronizationData psd = getPlayerData(playerID);
        removePlayer(playerID);
        psd.addSubscriber(subscriber);
        addPlayer(playerID, psd);
    }

    @Override
    public synchronized void removeSubscriber(String playerID, String subscriberID) {
        PlayerSynchronizationData psd = getPlayerData(playerID);
        removePlayer(playerID);
        psd.removeSubscriber(subscriberID);
        addPlayer(playerID, psd);
    }

    @Override
    public synchronized Collection<PlayerSubscriberData> getSubscribers(String playerID) {
        return hashOperations.get(keyForUserPlayers, playerID).getSubscribers();
    }

    @Override
    public synchronized PlayerSubscriberData getSubscriber(String playerID, String subscriberID) {
        return hashOperations.get(keyForUserPlayers, playerID).getSubscriber(subscriberID);
    }

    @Override
    public synchronized Boolean allSubscribersCanPlay(String playerID) {
        return hashOperations.get(keyForUserPlayers, playerID).isCanPlay();
    }

    @Override
    public synchronized Boolean doesPlayerExist(String playerID) {
        return hashOperations.hasKey(keyForUserPlayers, playerID);
    }

    @Override
    public synchronized Boolean isSubscriber(String playerID, String subscriberID) {
        return hashOperations.get(keyForUserPlayers, playerID).isSubscriber(subscriberID);
    }

    @Override
    public synchronized void updateSubscriber(String playerID, PlayerSubscriberData subscriber) {
        PlayerSynchronizationData psd = getPlayerData(playerID);
        removePlayer(playerID);
        psd.updateSubscriber(subscriber);
        addPlayer(playerID, psd);
    }
}
