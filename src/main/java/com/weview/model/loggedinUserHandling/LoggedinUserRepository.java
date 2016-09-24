package com.weview.model.loggedinUserHandling;

/**
 * This interface should be implemented for management of
 * logged-in users
 */
public interface LoggedinUserRepository {

    void login(String username);

    void logout(String username);

    Boolean isLoggedin(String username);
}
