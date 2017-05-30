package com.weview.model.persistence.entities;

import javax.persistence.*;
import java.util.Date;

/**
 * This class is a base JPA entity object, all types of user notifications
 * should derive from this base class
 */
@Entity
public abstract class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "notification_id")
    private Long id;

    private String message;

    @Column(columnDefinition="DATETIME")
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    protected Notification(){}

    public Notification(String message, Date date) {
        this.message = message;
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
