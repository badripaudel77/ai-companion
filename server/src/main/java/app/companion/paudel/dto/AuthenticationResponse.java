package app.companion.paudel.dto;

public record AuthenticationResponse(
        String token,
        String username,
        String role) {
}