package com.weview.utils;

import java.text.MessageFormat;
import java.util.Random;

/**
 * This class is used to generate simple string based identification
 */
public class RandomIDGenerator {

    private String[] adjectives = {
            "aggressive", "annoyed", "funny", "proud", "crazy", "sleepy",
            "angry", "inventive", "little", "short", "impressive", "chubby"
    };

    private String[] nouns = {
            "kitten", "puppie", "zeebra", "tiger", "panther", "cow",
            "wood-pecker", "polar-bear", "snake", "spider", "dinosaur", "elephant"
    };

    private String getRandomUserName(String[] arr) {
        int i = getRandomInt(arr.length);

        return arr[i];
    }

    private Integer getRandomInt(int limit) {
        return new Random().nextInt(limit);
    }

    public String generateID() {
        return MessageFormat.format("{0}-{1}-{2}",
                getRandomUserName(adjectives),
                getRandomUserName(nouns),
                getRandomInt(100));
    }
}
