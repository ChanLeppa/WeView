package com.weview.control;

import com.dropbox.core.DbxException;
import com.dropbox.core.DbxWebAuth;
import com.weview.control.exceptions.InvalidAuthDbxCodeException;
import com.weview.control.exceptions.UserNotFoundException;
import com.weview.model.dropbox.DropboxManager;
import com.weview.persistence.UserRepository;
import com.weview.persistence.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@RestController
public class DropboxController {
    @Autowired
    private UserRepository userRepository;

    private DropboxManager dropbox = new DropboxManager();

//    @CrossOrigin
//    @RequestMapping(value = "user/{username}/dropbox", method = RequestMethod.GET)
//    public String redirectToDropbox(@PathVariable("username") String username,
//                                    HttpServletRequest request){
//        HttpSession session = request.getSession(true);
//        session.setAttribute("username", username);
//        return dropbox.getToDropboxRedirectUri(session,"dropbox-auth-csrf-token");
//    }

    @RequestMapping(value = "user/{username}/dropbox", method = RequestMethod.GET)
    public String getToDropboxNoRedirectUri(@PathVariable("username") String username){
        return dropbox.getDropboxNoRedirectUri();
    }

    @RequestMapping(value = "user/{username}/filenames", method = RequestMethod.GET)
    public @ResponseBody List<String> getFilePathsDropbox(@PathVariable("username") String username) {
        List<String> pathFiles = new ArrayList<>();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException();
        }
        try {
            pathFiles =  dropbox.getListOfFileNames("", user.getDbxToken());
        } catch (DbxException e) {
            e.printStackTrace();
        }
        return pathFiles;
    }

//    @RequestMapping(value = "user/{username}/is-dbxtoken", method = RequestMethod.GET)
//    public Boolean checkForAccessToken(@PathVariable("username") String username,
//                                       HttpServletRequest request) {
//        HttpSession session = request.getSession();
//        User user = userRepository.findByUsername(username);
//
//        if (user == null) {
//            throw new UserNotFoundException();
//        }
//
//        String usernameSession = (String)session.getAttribute("username");
//
//        if(usernameSession == null || !usernameSession.equals(username)){
//            return false;
//        }
//
//        return (user.getDbxToken() != null);
//    }

    @RequestMapping(value = "user/{username}/is-dbxtoken", method = RequestMethod.GET)
    public Boolean checkForAccessToken(@PathVariable("username") String username) {
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new UserNotFoundException();
        }

        return (user.getDbxToken() != null);
    }

    @RequestMapping(value = "user/{username}/dbxfilelink", method = RequestMethod.GET)
    public String getDropboxLinkToFile(@PathVariable("username") String username,
                                                     @RequestParam("fileName") String fileName) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException();
        }
        return dropbox.getSourceLinkToFile(fileName, user.getDbxToken());
    }

    @RequestMapping(value = "user/{username}/dbxsendauth", method = RequestMethod.GET)
    public String saveAccessToken(@PathVariable("username") String username,
                                       @RequestParam("authcode") String authcode) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException();
        }

        String accessToken = null;
        try {
            accessToken = dropbox.getAccessToken(authcode);
        } catch (DbxException e) {
            e.printStackTrace();
            throw new InvalidAuthDbxCodeException();
        }

        user.setDbxToken(accessToken);
        userRepository.save(user);
        userRepository.flush();

        return "access token saved";
    }

//    @RequestMapping(value = "/dropbox-finish", method = RequestMethod.GET)
//    public void redirectFromDropbox(HttpServletRequest request, HttpServletResponse response) {
//        String accessToken = "";
//
//        try {
//            accessToken = dropbox.getAccessToken(request.getSession(true), "dropbox-auth-csrf-token", request.getParameterMap());
//        } catch (DbxWebAuth.NotApprovedException e) {
//            e.printStackTrace();
//        } catch (DbxWebAuth.BadRequestException e) {
//            e.printStackTrace();
//        } catch (DbxException e) {
//            e.printStackTrace();
//        } catch (DbxWebAuth.CsrfException e) {
//            e.printStackTrace();
//        } catch (DbxWebAuth.BadStateException e) {
//            e.printStackTrace();
//        } catch (DbxWebAuth.ProviderException e) {
//            e.printStackTrace();
//        }
//
//        String username = request.getSession().getAttribute("username").toString();
//        User user = userRepository.findByUsername(username);
//        if (user == null) {
//            throw new UserNotFoundException();
//        }
//        user.setDbxToken(accessToken);
//        userRepository.save(user);
//        userRepository.flush();
//
//        try {
//            response.sendRedirect("/user/" + username);
//        }
//        catch (Exception e) {
//            e.printStackTrace();
//        }
//    }

}
