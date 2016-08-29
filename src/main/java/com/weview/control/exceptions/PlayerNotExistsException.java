package com.weview.control.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "The player does not exist")
public class PlayerNotExistsException extends RuntimeException {

}
