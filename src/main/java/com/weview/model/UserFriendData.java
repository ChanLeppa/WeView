package com.weview.model;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class UserFriendData {

    private Set<UserDataForClient> friends = new HashSet<>();

    public Set<UserDataForClient> getFriends() {
        return friends;
    }
}
