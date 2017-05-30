package com.weview.model.persistence;

/**
 * This class is used as a simple data-transfer-object from the client
 * during login process
 */
public class UserLoginData {

    private String username;
    private String password;

    protected UserLoginData() {
    }

    public UserLoginData(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
