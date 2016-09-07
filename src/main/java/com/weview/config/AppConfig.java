package com.weview.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;

import java.net.URI;
import java.net.URISyntaxException;

@Configuration
@Import(WebSocketConfig.class)
public class AppConfig {

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        URI redisURI = null;
        try {
            redisURI = new URI(System.getenv("REDIS_URL"));
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        JedisConnectionFactory factory = new JedisConnectionFactory();
        factory.setHostName(redisURI.getHost());
//        factory.setHostName("redis://h:pbes6ltvi1464584if23s18u4qt@ec2-54-247-91-92.eu-west-1.compute.amazonaws.com:13389");
        factory.setPassword("pbes6ltvi1464584if23s18u4qt");
        factory.setPort(13389);
        factory.setUsePool(true);
        factory.afterPropertiesSet();
        return factory;
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) throws Exception {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<String, Object>();
        redisTemplate.setConnectionFactory(connectionFactory);

        return redisTemplate;
    }
}