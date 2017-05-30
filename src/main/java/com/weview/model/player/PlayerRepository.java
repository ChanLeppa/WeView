package com.weview.model.player;

import java.util.Collection;

/**
 * This interface should be implemented to manage the player representation
 * repository
 */
public interface PlayerRepository {

    void addPlayer(String playerID, PlayerSynchronizationData playerData);

    void removePlayer(String playerID);

    void updatePlayerTime(String playerID, Double time);

    PlayerSynchronizationData getPlayerData(String playerID);

    void addSubscriber(String playerID, PlayerSubscriberData subscriber);

    void removeSubscriber(String playerID, String subscriberID);

    Collection<PlayerSubscriberData> getSubscribers(String playerID);

    PlayerSubscriberData getSubscriber(String playerID, String subscriberID);

    void updateSubscriberToCanPlay(String playerID, String subscriberID);

    void updateSubscriberToCannotPlay(String playerID, String subscriberID);

    Boolean allSubscribersCanPlay(String playerID);

    Boolean doesPlayerExist(String playerID);

    Boolean isSubscriber(String playerID, String subscriberID);

    void updateSubscriber(String playerID, PlayerSubscriberData subscriber);

    void updatePlayerSrc(String playerID, String src);
}