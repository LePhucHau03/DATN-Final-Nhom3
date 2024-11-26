package com.example.demospringsecurity.service.impl;

import com.example.demospringsecurity.dto.ForgotPassDTO;
import com.example.demospringsecurity.dto.request.RegisterRequestDTO;
import com.example.demospringsecurity.dto.response.UserResponse;
import com.example.demospringsecurity.exception.InvalidDataException;
import com.example.demospringsecurity.model.User;
import com.example.demospringsecurity.repository.RoleRepository;
import com.example.demospringsecurity.repository.UserRepository;
import com.example.demospringsecurity.service.EmailService;
import com.example.demospringsecurity.service.SignupService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class SignupServiceImpl implements SignupService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final EmailService emailService;

    @Override
    public UserResponse register(RegisterRequestDTO registerRequestDTO) {
        if (userRepository.existsByEmail(registerRequestDTO.getEmail())) {
            throw new InvalidDataException("Email already exists");
        }
        if(!registerRequestDTO.getPassword().equals(registerRequestDTO.getConfirmPassword())) {
            throw new InvalidDataException("Passwords do not match");
        }
        User user = User.builder()
                .email(registerRequestDTO.getEmail())
                .name(registerRequestDTO.getName())
                .firstName(registerRequestDTO.getFirstName())
                .password(passwordEncoder.encode(registerRequestDTO.getPassword()))
                .role(roleRepository.findByName("ROLE_USER"))
                .enabled(true)
                .build();

        return UserResponse.fromUserToUserResponse(userRepository.save(user));
    }

    @Override
    public void verifyUser(String verificationCode) {

    }

    @Override
    public void resendVerificationCode(String email) {

    }

    @Override
    public void sendVerificationEmail(User user) {

    }

    @Override
    public void forgotPassword(ForgotPassDTO forgotPassDTO) {
        User user = userRepository.findByEmail(forgotPassDTO.getEmail());
        if(user == null) {
            throw new InvalidDataException("User with email do not found");
        }

        if(!user.getFirstName().equals(forgotPassDTO.getFirstName())) {
            throw new InvalidDataException("First name does not match");
        }

        if(!user.getName().equalsIgnoreCase(forgotPassDTO.getLastName())){
            throw new InvalidDataException("Last name does not match");
        }

        String newPassword = this.generateVerificationCode();

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);

        String subject = "Your new Password";
        String htmlMessage = "<html>"
                + "<body>"
                + "<h2>Your new password</h2>"
                + "<b>" + newPassword + "</b>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}
