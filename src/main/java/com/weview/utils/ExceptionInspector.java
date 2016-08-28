package com.weview.utils;

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
