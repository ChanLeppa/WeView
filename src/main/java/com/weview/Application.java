package com.weview;

import com.weview.config.AppConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.redis.connection.RedisConnectionFactory;

@SpringBootApplication
@ComponentScan
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        flushAllRedisServer();
    }

    private static void flushAllRedisServer() {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
        RedisConnectionFactory redisConnectionFactory = ctx.getBean(RedisConnectionFactory.class);
        redisConnectionFactory.getConnection().flushAll();
    }
}