package com.weview.model.loggedinUserHandling;

public interface LoggedinUserRepository {

    void login(String username);

    void logout(String username);

    Boolean isLoggedin(String username);
}
