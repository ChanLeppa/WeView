package com.weview.control;

import com.weview.model.loggedinUserHandling.RedisLoggeinUserRepository;
import com.weview.persistence.User;
import com.weview.persistence.UserRepository;
import com.weview.utils.ExceptionInspector;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.web.bind.annotation.*;

import java.io.Console;
import java.sql.SQLIntegrityConstraintViolationException;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

//    @RequestMapping(value = "/signup", method = RequestMethod.POST)
//    public String signup(@RequestParam("username") String username,
//                  @RequestParam("password") String password,
//                  @RequestParam("fname") String fname,
//                  @RequestParam("lname") String lname,
//                  @RequestParam("email") String email)
//    {
//        User user = new User(fname, lname, username, email, password);
//
//        try {
//            if (!user.getFirstName().equals("Ron")) {
//                User ron = userRepository.findByUsername("ronbiryon");
//                user.getFriends().add(ron);
//            }
//
//            userRepository.save(user);
//        }
//        catch (Exception e) {
//            e.printStackTrace();
//            return "booo!!!";
//        }
//
//        return "bazinga!!";
//    }

    @RequestMapping(value = "/signup", method = RequestMethod.POST)
    public String signup(@RequestBody User newUser) {

        try {
            userRepository.save(newUser);
        }
        catch (DataAccessException e) {
            Throwable cause = ExceptionInspector.getRootCause(e);
            String msg = cause.getMessage();
            System.out.println(msg);
        }

        return "bazinga!!";
    }
}
