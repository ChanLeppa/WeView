package com.weview.model;

import java.util.HashMap;
import java.util.Map;

public class UserFriendData {

    private Map<Boolean, UserDataForClient> friends = new HashMap<>();

    public Map<Boolean, UserDataForClient> getFriends() {
        return friends;
    }
}
