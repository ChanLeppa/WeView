package com.weview.config;

import com.weview.model.PlayerSubscriberData;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.text.MessageFormat;
import java.util.Map;
import java.util.Random;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {

//    private WebSocketSessionHandler webSocketSessionHandler = WebSocketSessionHandler.getInstance();

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/connect").setHandshakeHandler(new RandomUsernameHandshakeHandler()).withSockJS();
    }

    private class RandomUsernameHandshakeHandler extends DefaultHandshakeHandler {

        private String[] adjectives = {
                "aggressive", "annoyed", "funny", "proud", "crazy", "sleepy",
                "angry", "inventive", "little", "short", "impressive", "chubby"
        };
        private String[] nouns = {
                "kitten", "puppie", "zeebra", "tiger", "panther", "cow",
                "wood-pecker", "polar-bear", "snake", "spider", "dinosaur", "elephant"
        };

        @Override
        protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
            String username = MessageFormat.format("{0}-{1}-{2}",
                    getRandomUserName(adjectives),
                    getRandomUserName(nouns),
                    getRandomInt(100));

//            webSocketSessionHandler.getSubscribers().put(username, new PlayerSubscriberData(username));

            return () -> username;
        }

        private String getRandomUserName(String[] arr) {
            int i = getRandomInt(arr.length);

            return arr[i];
        }

        private Integer getRandomInt(int limit) {
            return new Random().nextInt(limit);
        }
    }

//    private class UserHandshakeHandler extends DefaultHandshakeHandler {
//
//        @Override
//        protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
//            return null;
//        }
//    }
}