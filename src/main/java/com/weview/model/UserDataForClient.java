package com.weview.model;

public class UserDataForClient {

    private final String username;
    private final String firstName;
    private final String lastName;
//    private Boolean isLoggedIn;
//    private photo;

    public UserDataForClient(String username, String firstName, String lastName) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
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
}
