package com.weview.control;

import com.weview.control.exceptions.InvalidPasswordException;
import com.weview.control.exceptions.UserNotFoundException;
import com.weview.control.exceptions.UserFieldConstraintException;
import com.weview.control.exceptions.UserFieldViolationErrorInfo;
import com.weview.model.UserDataForClient;
import com.weview.model.UserFriendData;
import com.weview.model.loggedinUserHandling.RedisLoggedinUserRepository;
import com.weview.persistence.User;
import com.weview.persistence.UserRepository;
import com.weview.utils.ExceptionInspector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLIntegrityConstraintViolationException;

@RestController
public class UserRestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RedisLoggedinUserRepository loggedInUserRepository;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public String login(@RequestParam String username, @RequestParam String password) {

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new UserNotFoundException();
        }

        if (!user.getPassword().equals(password)) {
            throw new InvalidPasswordException();
        }

        loggedInUserRepository.login(username);

        return "redirect: /user/" + username;
    }

    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public String logout(@RequestParam String username) {

        if (!loggedInUserRepository.isLoggedin(username)) {
            throw new UserNotFoundException();
        }

        loggedInUserRepository.logout(username);

        //TODO: Should we destroy the user's player? What if others continue to watch? Unsubscribe with ref count?

        return "redirect: /";
    }

    @RequestMapping(value = "/signup", method = RequestMethod.POST)
    public String signup(@RequestBody User newUser) {

        try {
            userRepository.save(newUser);
            loggedInUserRepository.login(newUser.getUsername());
        }
        catch (DataAccessException e) {
            Throwable cause = ExceptionInspector.getRootCause(e);
            if (cause instanceof SQLIntegrityConstraintViolationException) {
                SQLIntegrityConstraintViolationException sqlConstraint =
                        (SQLIntegrityConstraintViolationException)cause;
                throw new UserFieldConstraintException(newUser, sqlConstraint);
            }
            else {
                throw e;
            }
        }
        catch (Exception e) {
            throw e;
        }

        return "redirect: /user/" + newUser.getUsername();
    }

    @RequestMapping(value = "/user/{username}", method = RequestMethod.GET)
    public UserDataForClient getUserClientData(@PathVariable("username") String username) {

        User theUser = userRepository.findByUsername(username);

        //TODO:
        // 1. Check if logged in
        // 2. Handle friends
        if (theUser == null) {
            throw new UserNotFoundException();
        }

        return getUserDataForClient(theUser);
    }

    @RequestMapping(value = "/user/{username}/friends", method = RequestMethod.GET)
    public UserFriendData getUserFriends(@PathVariable("username") String username) {

        UserFriendData userFriends = new UserFriendData();
        User user = userRepository.findByUsername(username);

        //TODO:
        // 1. Check if logged in
        if (user == null) {
            throw new UserNotFoundException();
        }

        for (User friend :user.getAllFriends()) {
            UserDataForClient friendData = getUserDataForClient(friend);
            userFriends.getFriends().put(
                    loggedInUserRepository.isLoggedin(friendData.getUsername()),
                    friendData);
        }

        return userFriends;
    }

    @RequestMapping(value = "/user/{username}/make-friend", method = RequestMethod.POST)
    public String makeFriend(@PathVariable("username") String usernameToBefriend,
                             @RequestParam String username) {

        User userRequesting = userRepository.findByUsername(username);
        User userToBefriend = userRepository.findByUsername(usernameToBefriend);

        if (userRequesting == null || userToBefriend == null) {
            throw new UserNotFoundException();
        }

        userRequesting.addFriend(userToBefriend);

        userRepository.save(userRequesting);

        //TODO: Return better argument
        return "Bazinga!!!";
    }

    private UserDataForClient getUserDataForClient(User friend) {
        return new UserDataForClient(friend.getUsername(), friend.getFirstName(), friend.getLastName());
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(UserFieldConstraintException.class)
    public UserFieldViolationErrorInfo handleUserFieldException(UserFieldConstraintException ex) {
        return new UserFieldViolationErrorInfo(ex.getException(), ex.getViolatingUser());
    }

}
