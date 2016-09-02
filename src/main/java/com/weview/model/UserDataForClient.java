package com.weview.model;

public class UserDataForClient {

    private final String username;
    private final String firstName;
    private final String lastName;
    private Boolean isLoggedIn;
    private Boolean dbxTokenExists;
    //    private photo;

    public UserDataForClient(String username, String firstName, String lastName, Boolean isLoggedIn, Boolean dbxTokenExists) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isLoggedIn = isLoggedIn;
        this.dbxTokenExists = dbxTokenExists;
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
