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
    public void addPlayer(String playerId, PlayerSynchronizationData playerData) {
        hashOperations.put(keyForUserPlayers, playerId, playerData);
    }

    @Override
    public void removePlayer(String playerId) {
        hashOperations.delete(keyForUserPlayers, playerId);
    }

    @Override
    public PlayerSynchronizationData getPlayerData(String playerId) {
        return hashOperations.get(keyForUserPlayers, playerId);
    }

    @Override
    public void addSubscriber(String playerID, PlayerSubscriberData subscriber) {
        hashOperations.get(keyForUserPlayers, playerID).addSubscriber(subscriber);
    }

    @Override
    public void removeSubscriber(String playerID, String subscriberID) {
        hashOperations.get(keyForUserPlayers, playerID).removeSubscriber(subscriberID);
    }

    @Override
    public Collection<PlayerSubscriberData> getSubscribers(String playerID) {
        return hashOperations.get(keyForUserPlayers, playerID).getSubscribers();
    }

    @Override
    public PlayerSubscriberData getSubscriber(String playerID, String subscriberID) {
        return hashOperations.get(keyForUserPlayers, playerID).getSubscriber(subscriberID);
    }

    @Override
    public Boolean allSubscribersCanPlay(String playerID) {
        return hashOperations.get(keyForUserPlayers, playerID).isCanPlay();
    }

    @Override
    public Boolean doesPlayerExist(String playerID) {
        return hashOperations.hasKey(keyForUserPlayers, playerID);
    }

    @Override
    public Boolean isSubscriber(String playerID, String subscriberID) {
        return hashOperations.get(keyForUserPlayers, playerID).isSubscriber(subscriberID);
    }

    @Override
    public synchronized void updateSubscriber(String playerID, PlayerSubscriberData subscriber) {
        hashOperations.get(keyForUserPlayers, playerID).removeSubscriber(subscriber.getUsername());
        hashOperations.get(keyForUserPlayers, playerID).addSubscriber(subscriber);
    }
}
