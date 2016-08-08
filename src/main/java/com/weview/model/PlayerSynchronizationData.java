package com.weview.model;

import java.io.Serializable;

public class PlayerSynchronizationData implements Serializable {

    private String src;
    private String callBackName;
    private Double time;
    private Boolean canPlay;
    private Boolean playing;

    public String getSrc() {
        return src;
    }

    public String getCallBackName() {
        return callBackName;
    }

    public void setSrc(String src) {
        this.src = src;
    }

    public void setCallBackName(String callBackName) {
        this.callBackName = callBackName;
    }

    public Double getTime() {
        return time;
    }

    public void setTime(Double time) {
        this.time = time;
    }

    public Boolean getCanPlay() {
        return canPlay;
    }

    public void setCanPlay(Boolean canPlay) {
        this.canPlay = canPlay;
    }

    public Boolean getPlaying() {
        return playing;
    }

    public void setPlaying(Boolean playing) {
        this.playing = playing;
    }
}