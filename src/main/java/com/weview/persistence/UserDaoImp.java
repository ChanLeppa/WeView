//package com.weview.model;
//
//import org.hibernate.SessionFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Repository;
//
//@Repository
//public class UserDaoImp implements UserDao{
//
//    @Autowired
//    private SessionFactory session;
//
//    @Override
//    public void addUser(User user) {
//        session.getCurrentSession().save(user);
//    }
//
//    @Override
//    public void removeUser(String userID) {
//        session.getCurrentSession().delete(getUser(userID));
//    }
//
//    @Override
//    public User getUser(String userID) {
//        return (User)session.getCurrentSession().get(User.class, userID);
//    }
//
//    @Override
//    public void updateUser(User updatedUser) {
//        session.getCurrentSession().update(updatedUser);
//    }
//}
