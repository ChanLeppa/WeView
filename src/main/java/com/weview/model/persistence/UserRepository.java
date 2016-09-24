package com.weview.model.persistence;

import com.weview.model.persistence.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * This interface is used for CRUD operations and user data retrieval in the database.
 * There is no implementation for this class due to the ability of the
 * Spring framework to implement it automatically
 */
public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

    User findByEmail(String email);

}
