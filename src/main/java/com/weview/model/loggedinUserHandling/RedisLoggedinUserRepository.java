package com.weview.model.loggedinUserHandling;

import org.omg.CORBA.Object;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

@Component
public class RedisLoggedinUserRepository implements LoggedinUserRepository {

    private final String keyForLoggedInUsers = "LOGGEDIN_USERS";
    private static RedisLoggedinUserRepository instance;

    private RedisTemplate<String, String> redisTemplate;

    @Resource(name = "redisTemplate")
    private SetOperations<String, String> setOperations;

    @Autowired
    private RedisLoggedinUserRepository(RedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void login(String username) {
        setOperations.add(keyForLoggedInUsers, username);
    }

    @Override
    public void logout(String username) {
        setOperations.remove(keyForLoggedInUsers, username);
    }

    @Override
    public Boolean isLoggedin(String username) {
        return setOperations.isMember(keyForLoggedInUsers, username);
    }
}
