package com.weview.utils;

/**
 * This class is a utility class for retrieving needed data from exceptions
 */
public class ExceptionInspector {

    public static Throwable getRootCause(Throwable exception) {

        Throwable cause = null;
        Throwable result = exception;

        while(null != (cause = result.getCause())  && (result != cause) ) {
            result = cause;
        }

        return result;
    }
}
