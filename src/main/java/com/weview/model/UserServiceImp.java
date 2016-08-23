package com.weview.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    private UserDao userDao;

    @Transactional
    public void addUser(User user) {
        userDao.addUser(user);
    }

    @Transactional
    public void removeUser(String userID) {
        userDao.removeUser(userID);
    }

    @Transactional
    public User getUser(String userID) {
        return userDao.getUser(userID);
    }

    @Transactional
    public void updateUser(User updatedUser) {
        userDao.updateUser(updatedUser);
    }
}
