package com.weview.model;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * This class is a data-transfer-object used to send the user's
 * friend basic data and state to the client
 */
public class UserFriendData {

    private Set<UserDataForClient> friends = new HashSet<>();

    public Set<UserDataForClient> getFriends() {
        return friends;
    }
}
