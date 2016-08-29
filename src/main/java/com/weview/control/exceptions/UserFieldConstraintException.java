package com.weview.control.exceptions;

import com.weview.persistence.User;

import java.sql.SQLIntegrityConstraintViolationException;

public class UserFieldConstraintException extends RuntimeException{

    private SQLIntegrityConstraintViolationException exception;
    private User violatingUser;

    public UserFieldConstraintException(User violatingUser, SQLIntegrityConstraintViolationException exception) {
        this.violatingUser = violatingUser;
        this.exception = exception;
    }

    public SQLIntegrityConstraintViolationException getException() {
        return exception;
    }

    public User getViolatingUser() {
        return violatingUser;
    }
}
