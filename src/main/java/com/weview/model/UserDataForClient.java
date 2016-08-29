package com.weview.model;

public class UserDataForClient {

    private final String username;
    private final String firstName;
    private final String lastName;
    private Boolean isLoggedIn;
//    private photo;

    public UserDataForClient(String username, String firstName, String lastName, Boolean isLoggedIn) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isLoggedIn = isLoggedIn;
    }

    public String getUsername() {
        return username;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public Boolean getLoggedIn() {
        return isLoggedIn;
    }

    public void setLoggedIn() {
        isLoggedIn = true;
    }

    public void setLoggedOut() {
        isLoggedIn = false;
    }
}
