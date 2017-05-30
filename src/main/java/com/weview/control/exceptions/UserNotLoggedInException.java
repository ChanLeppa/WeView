package com.weview.control.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "The user is not logged in")
public class UserNotLoggedInException extends RuntimeException {

}
