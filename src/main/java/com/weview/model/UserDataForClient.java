package com.weview.model;

public class UserDataForClient {

    private final String username;
    private final String email;
    private final String firstName;
    private final String lastName;
    private final String icon;
    private Boolean isLoggedIn;
    private Boolean dbxTokenExists;

    public UserDataForClient(String username, String email, String firstName, String lastName, Boolean isLoggedIn, Boolean dbxTokenExists, String icon) {
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isLoggedIn = isLoggedIn;
        this.dbxTokenExists = dbxTokenExists;
        this.icon = icon;
    }

    public String getEmail() {
        return email;
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

    public String getIcon() {
        return icon;
    }

    public Boolean isLoggedIn() {
        return isLoggedIn;
    }

    public void setLoggedIn() {
        isLoggedIn = true;
    }

    public void setLoggedOut() {
        isLoggedIn = false;
    }

    public Boolean isDbxTokenExists() {
        return dbxTokenExists;
    }

    public void setDbxTokenExists() {
        this.dbxTokenExists = true;
    }
    public void setDbxTokenNotExists() {
        this.dbxTokenExists = false;
    }
}
