package com.weview.control.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "The password that was entered is invalid")
public class InvalidPasswordException extends RuntimeException {

}
