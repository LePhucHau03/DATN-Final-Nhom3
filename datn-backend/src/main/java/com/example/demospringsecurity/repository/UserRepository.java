package com.example.demospringsecurity.repository;

import com.example.demospringsecurity.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface UserRepository extends JpaRepository<User, Long> , JpaSpecificationExecutor<User> {
    User findByName(String name);
    User findByEmail(String email);
    boolean existsByEmail(String email);
    User findByEmailAndRefreshToken(String email, String refreshToken);
    User findByVerificationCode(String verificationCode);

    @Query(value = "select users.email, count(orders.id) as order_count " +
            "from users " +
            "join orders on users.id = orders.user_id " +
            "group by users.id " +
            "order by order_count desc " +
            "limit 3", nativeQuery = true)
    List<Object[]> countUserOrder();

}
