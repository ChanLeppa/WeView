package com.weview.control.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT, reason = "The player already exists")
public class PlayerDuplicateException extends RuntimeException {

}
