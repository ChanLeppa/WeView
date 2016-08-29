package com.weview.persistence.entities;

import javax.persistence.*;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String dbxToken;

    private String photo;

    @ManyToMany
    @JoinTable(
            name = "friends",
            joinColumns = @JoinColumn(name = "user_a"),
            inverseJoinColumns = @JoinColumn(name = "user_b"))
    private Set<User> friends = new HashSet<>();

    @ManyToMany(mappedBy = "friends", cascade = CascadeType.ALL)
    private Set<User> friendedBy = new HashSet<>();

    @OneToMany
    @JoinColumn(name = "notification_id")
    private Map<String, FriendRequestNotification> friendRequests = new HashMap();

    protected User(){}

    public User(String firstName, String lastName, String username, String email, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDbxToken() {
        return dbxToken;
    }

    public void setDbxToken(String dbxToken) {
        this.dbxToken = dbxToken;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String userPhoto) {
        this.photo = userPhoto;
    }

    public Set<User> getFriends() {
        return friends;
    }

    public Set<User> getFriendedBy() {
        return friendedBy;
    }

    public Set<User> getAllFriends() {
        Set<User> allFriends = friends;

        for (User friend :friendedBy) {
            if (!allFriends.contains(friend)) {
                allFriends.add(friend);
            }
        }

        return allFriends;
    }

    public void addFriend(User user) {
        friends.add(user);
    }

    public Map<String, FriendRequestNotification> getFriendRequests() {
        return friendRequests;
    }

    public void addFriendRequest(FriendRequestNotification request) {
        if (!isAlreadyRequested(request.getRequestingUsername()) &&
                !isAlreadyFriend(request.getRequestingUsername())) {
            friendRequests.put(request.getRequestingUsername(), request);
        }
        else {
            updateRequest(request);
        }
    }


    private Boolean isAlreadyRequested(String username) {
        return friendRequests.containsKey(username);
    }

    private Boolean isAlreadyFriend(String username) {
        Boolean isAlreadyFriend = false;
        for (User friend :getAllFriends()) {
            if (friend.getUsername().equals(username)) {
                isAlreadyFriend = true;
                break;
            }
        }

        return isAlreadyFriend;
    }

    private void updateRequest(FriendRequestNotification request) {
        FriendRequestNotification oldRequest = friendRequests.get(request.getRequestingUsername());
        if (oldRequest != null) {
            removeFriendRequest(oldRequest.getRequestingUsername());
            addFriendRequest(request);
        }
    }

    public void removeFriendRequest(String username) {
        if (isAlreadyRequested(username)) {
            friendRequests.remove(username);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        User user = (User) o;

        if (!id.equals(user.id)) return false;
        if (firstName != null ? !firstName.equals(user.firstName) : user.firstName != null) return false;
        if (lastName != null ? !lastName.equals(user.lastName) : user.lastName != null) return false;
        return username.equals(user.username) && (email != null ? email.equals(user.email) : user.email == null);

    }

    @Override
    public int hashCode() {
        int result = id.hashCode();
        result = 31 * result + (firstName != null ? firstName.hashCode() : 0);
        result = 31 * result + (lastName != null ? lastName.hashCode() : 0);
        result = 31 * result + username.hashCode();
        result = 31 * result + (email != null ? email.hashCode() : 0);
        return result;
    }
}

