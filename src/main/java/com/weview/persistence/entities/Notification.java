package com.weview.persistence.entities;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "notification_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id", nullable = false)
    private User user;

    private String message;
    private Date date;

    protected Notification(){}

    public Notification(String message, Date date) {
        this.message = message;
        this.date = date;
    }

    public User getUser() {
        return user;
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
