package com.weview.control;

import com.weview.control.exceptions.*;
import com.weview.model.UserDataForClient;
import com.weview.model.UserFriendData;
import com.weview.model.loggedinUserHandling.RedisLoggedinUserRepository;
import com.weview.persistence.UserLoginData;
import com.weview.persistence.entities.FriendRequestNotification;
import com.weview.persistence.entities.User;
import com.weview.persistence.UserRepository;
import com.weview.utils.ExceptionInspector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLIntegrityConstraintViolationException;
import java.text.MessageFormat;
import java.util.Collection;
import java.util.Date;
import java.util.Map;
import java.util.Set;

@RestController
public class UserRestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RedisLoggedinUserRepository loggedInUserRepository;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public String login(@RequestBody UserLoginData userLoggingIn) {

        String username = userLoggingIn.getUsername();
        String password = userLoggingIn.getPassword();
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new UserNotFoundException();
        }

        if (!user.getPassword().equals(password)) {
            throw new InvalidPasswordException();
        }

        loggedInUserRepository.login(username);

        return "/user/" + username;
    }

    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public String logout(@RequestParam String username) {

        if (!loggedInUserRepository.isLoggedin(username)) {
            throw new UserNotLoggedInException();
        }

        loggedInUserRepository.logout(username);

        //TODO: Should we destroy the user's player? What if others continue to watch? Unsubscribe with ref count?

        return "redirect: /";
    }

    @RequestMapping(value = "/signup", method = RequestMethod.POST)
    public String signup(@RequestBody User newUser) {
        User user = newUser;
        try {
            userRepository.save(newUser);
            userRepository.flush();
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

        return "/user/" + newUser.getUsername();
    }

    @RequestMapping(value = "/user/{username}/user-data", method = RequestMethod.GET)
    public UserDataForClient getUserClientData(@PathVariable("username") String username) {

        //TODO: Handle friends
        User theUser = getLoggedInUser(username);
        return getUserDataForClient(theUser);
    }

    @RequestMapping(value = "/user/{username}/friends", method = RequestMethod.GET)
    public UserFriendData getUserFriends(@PathVariable("username") String username) {

        UserFriendData userFriends = new UserFriendData();
        User user = getLoggedInUser(username);

        for (User friend :user.getAllFriends()) {
            UserDataForClient friendData = getUserDataForClient(friend);
            userFriends.getFriends().add(friendData);
        }

        return userFriends;
    }

    private User getLoggedInUser(String username) throws UserNotFoundException, UserNotLoggedInException{
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException();
        }
        if (!loggedInUserRepository.isLoggedin(user.getUsername())) {
            throw new UserNotLoggedInException();
        }

        return user;
    }

    @RequestMapping(value = "/user/{username}/make-friend", method = RequestMethod.POST)
    public String makeFriend(@PathVariable("username") String usernameToBefriend,
                             @RequestParam String username) {
        //TODO: Friend request
        User userRequesting = userRepository.findByUsername(username);
        User userToBefriend = userRepository.findByUsername(usernameToBefriend);

        if (userToBefriend == null || userRequesting == null) {
            throw new UserNotFoundException();
        }

        userRequesting.addFriend(userToBefriend);

        userRepository.save(userRequesting);
        userRepository.flush();

        //TODO: Return better argument
        return "Bazinga!!!";
    }

    @RequestMapping(value = "/user/{username}/friend-request", method = RequestMethod.POST)
    public String makeFriendRequest(@PathVariable("username") String usernameRequesting,
                                    @RequestParam String username) {

        User friend = null;
        if ((friend = userRepository.findByUsername(username)) == null) {
            throw new UserNotFoundException();
        }

        notifyUserOfFriendRequest(friend, usernameRequesting);

        //Returns JSON that indicates that the user is logged in
        //so that the requesting client can send him the request via websocket
        Boolean isFriendLoggedIn = loggedInUserRepository.isLoggedin(friend.getUsername());
        return "{\"isFriendLoggedIn\" : \"" + isFriendLoggedIn.toString() + "\"}";
    }

    @RequestMapping(value = "/user/{username}/search-friend", method = RequestMethod.GET)
    public User searchFriend(@PathVariable("username") String usernameRequesting,
                                    @RequestParam String searchParam) {
        User friend = null;
        if ((friend = userRepository.findByUsername(searchParam)) == null &&
                (friend = userRepository.findByEmail(searchParam)) == null) {
            throw new UserNotFoundException();
        }

        return friend;
    }

    private void notifyUserOfFriendRequest(User user, String usernameRequesting) {
        String message = MessageFormat.format("{0} has invited you to be his friend", usernameRequesting);
        Date date = new Date();
        user.addFriendRequest(new FriendRequestNotification(message, date, usernameRequesting));
        userRepository.save(user);
        userRepository.flush();
    }

    private UserDataForClient getUserDataForClient(User user) {
        String username = user.getUsername();
        Boolean isLoggedin = loggedInUserRepository.isLoggedin(username);
        Boolean isDbxToken = (user.getDbxToken() != null);
        return new UserDataForClient(username, user.getFirstName(), user.getLastName(), isLoggedin, isDbxToken);
    }

    @RequestMapping(value = "/user/{username}/friend-requests-notifications", method = RequestMethod.GET)
    public Collection<FriendRequestNotification> getFriendRequests(@PathVariable("username") String username) {
        User user = getLoggedInUser(username);
        return user.getFriendRequests().values();
    }

    @RequestMapping(value = "/user/{username}/photo", method = RequestMethod.GET)
    public byte[] getUserPhoto(@PathVariable("username") String username) {
        User user = getLoggedInUser(username);
        return user.getPhoto();
    }

    @RequestMapping(value = "/user/{username}/photo", method = RequestMethod.POST)
    public void uploadUserPhoto(@PathVariable("username") String username, byte[] photo) {
        User user = getLoggedInUser(username);
        user.setPhoto(photo);
        userRepository.save(user);
        userRepository.flush();
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(UserFieldConstraintException.class)
    public UserFieldViolationErrorInfo handleUserFieldException(UserFieldConstraintException ex) {
        return new UserFieldViolationErrorInfo(ex.getException(), ex.getViolatingUser());
    }

}
