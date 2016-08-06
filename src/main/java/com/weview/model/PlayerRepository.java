package com.weview.model;

import java.util.Collection;


/*Should we split into PlayerRepo and PlayerSubscriberRepo?!?!?*/
interface PlayerRepository {

    void addPlayer(String playerID, PlayerSyncronizationData playerData/*, SyncBean or other player representation*/);

    void removePlayer(String playerID);

    PlayerSyncronizationData getPlayerData(String playerID);

    void addSubscriber(String playerID, PlayerSubscriberData subscriber);

    void removeSubscriber(String playerID, String subscriberID);

    Collection<PlayerSubscriberData> getSubscribers(String playerID);

    PlayerSubscriberData getSubscriber(String playerID, String subscriberID);

    Boolean allSubscribersCanPlay(String playerID);
}