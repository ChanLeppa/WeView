package com.weview.model;

import java.util.Collection;

interface UserRepository {

    void addUser(User user);

    void removeUser(String userID);

    User getUser(String userID);

    void updateUser(String userID, User updatedUser);

    void addFriend(String userID, String friendID);

    void removeFriend(String userID, String friendID);

    Collection<User> getFriends(String userID);
}