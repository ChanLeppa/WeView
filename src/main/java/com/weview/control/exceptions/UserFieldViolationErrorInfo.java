package com.weview.control.exceptions;

import com.weview.model.persistence.entities.User;

import java.sql.SQLIntegrityConstraintViolationException;

public class UserFieldViolationErrorInfo {

    public String violationField;

    public UserFieldViolationErrorInfo(SQLIntegrityConstraintViolationException ex, User user) {
        this.violationField = setViolationField(ex, user);
    }

    private String setViolationField(
            SQLIntegrityConstraintViolationException cause,
            User violatingUserEntry) {

        String violationField = null;

        String msg = cause.getMessage();
        String[] splitMsg =  msg.split("'");
        String field = splitMsg[1];

        if (splitMsg[0].contains("Column")) {
            violationField = "nonNullableField";
        }
        else if (splitMsg[0].contains("Duplicate")) {
            if (field.equals(violatingUserEntry.getUsername())) {
                violationField = "username";
            }
            else if (field.equals(violatingUserEntry.getEmail())) {
                violationField = "email";
            }
        }

        return violationField;
    }
}
