package com.weview.model.player;

/**
 * This enum is used to represent the different player call back states
 * the client may receive
 */
public enum PlayerCallback {

    PLAY,
    STOP,
    PAUSE,
    SYNC,
    ENDED,
    SRC,
    ERROR
}
