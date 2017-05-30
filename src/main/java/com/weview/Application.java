package com.weview;

import com.weview.config.AppConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.data.redis.connection.RedisConnectionFactory;

/**
 * This class is the main entry-point of the Spring-Boot application
 */
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        flushAllRedisServer();
    }

    /**
     * This method is used to delete all of the saved, and unwanted, previous data
     * in the Redis database
     */
    private static void flushAllRedisServer() {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
        RedisConnectionFactory redisConnectionFactory = ctx.getBean(RedisConnectionFactory.class);
        redisConnectionFactory.getConnection().flushAll();
    }
}