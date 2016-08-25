package com.weview.persistence;

import javax.persistence.*;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String fname;

    private String lname;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true)
    private String email;

    private String password;

    private String dbxtoken;

    private Boolean isloggedin;

    private String photo;

    public User(){}

    public Long getId() {
        return id;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDbxtoken() {
        return dbxtoken;
    }

    public void setDbxtoken(String dbxtoken) {
        this.dbxtoken = dbxtoken;
    }

    public Boolean getLoggedIn() {
        return isloggedin;
    }

    public void setLoggedIn(Boolean loggedIn) {
        isloggedin = loggedIn;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String userPhoto) {
        this.photo = userPhoto;
    }
}

