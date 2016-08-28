package com.weview.control;

import com.weview.control.exceptions.UserNotFoundException;
import com.weview.control.exceptions.UserUniqueFieldConstraintException;
import com.weview.control.exceptions.UserFieldViolationErrorInfo;
import com.weview.model.UserDataForClient;
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
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RedisLoggedinUserRepository loggedInUserRepository;

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
                throw new UserUniqueFieldConstraintException(newUser, sqlConstraint);
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

        return new UserDataForClient(theUser.getUsername(), theUser.getFirstName(), theUser.getLastName());
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(UserUniqueFieldConstraintException.class)
    public UserFieldViolationErrorInfo handleUserFieldException(UserUniqueFieldConstraintException ex) {
        return new UserFieldViolationErrorInfo(ex.getException(), ex.getViolatingUser());
    }

}
