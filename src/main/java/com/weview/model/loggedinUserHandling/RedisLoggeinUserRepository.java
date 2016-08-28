package com.weview.model.loggedinUserHandling;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;

import javax.annotation.Resource;

public class RedisLoggeinUserRepository implements LoggedinUserRepository {

    private final String keyForLoggedInUsers = "LOGGEDIN_USERS";
    private RedisTemplate<String, Object> redisTemplate;

    @Resource(name = "redisTemplate")
    private SetOperations<String, String> setOperations;

    @Autowired
    public RedisLoggeinUserRepository(RedisTemplate<String, Object> redisTemplate) {
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
