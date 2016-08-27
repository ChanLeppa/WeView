package com.weview.control;

import com.weview.persistence.User;
import com.weview.persistence.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @RequestMapping(value = "/signup", method = RequestMethod.POST)
    public String signup(@RequestParam("username") String username,
                  @RequestParam("password") String password,
                  @RequestParam("fname") String fname,
                  @RequestParam("lname") String lname,
                  @RequestParam("email") String email)
    {
        User user = new User(username);

        user.setFirstName(fname);
        user.setLname(lname);
        user.setEmail(email);
        user.setPassword(password);

        try {
            userRepository.save(user);
        }
        catch (Exception e) {
            e.printStackTrace();
            return "booo!!!";
        }

        return "bazinga!!";
    }
}
