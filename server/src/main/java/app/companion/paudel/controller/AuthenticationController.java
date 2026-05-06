package app.companion.paudel.controller;

import app.companion.paudel.dto.AuthenticationRequest;
import app.companion.paudel.dto.AuthenticationResponse;
import app.companion.paudel.dto.RegisterRequest;
import app.companion.paudel.exceptions.BadRequestException;
import app.companion.paudel.exceptions.ResourceNotFoundException;
import app.companion.paudel.model.Role;
import app.companion.paudel.model.User;
import app.companion.paudel.repository.UserRepository;
import app.companion.paudel.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/{version}/companion/auth", version = "v1")
@RequiredArgsConstructor
public class AuthenticationController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @GetMapping()
    public String welcome() {
        return "Welcome to Your own AI Companion, your ultimate private AI documents assistant.";
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) throws BadRequestException {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email or Username already exists");
        }
        User user = User.builder()
                .fullname(request.fullname())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .build();
        userRepository.save(user);
        return ResponseEntity.status(200)
                .body(new AuthenticationResponse(null, user.getEmail(), user.getRole().name()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) throws BadRequestException {
        User user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }
        String token = jwtUtil.generateAccessToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name());
        String primaryRole = user.getRole().name();
        return ResponseEntity.status(200)
                .body(new AuthenticationResponse(token, user.getEmail(), primaryRole));
    }
}
