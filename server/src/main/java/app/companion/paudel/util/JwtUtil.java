package app.companion.paudel.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Getter
    @Value("${mycompanion.JWT_SECRET}")
    private String secret;

    @Value("${mycompanion.ACCESS_TOKEN_VALIDITY:3600000}") // 1 hour default
    private long accessTokenValidityMs;

    // ------------------------------
    //  INTERNAL KEY
    // ------------------------------
    private Key getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ------------------------------
    // GENERATE TOKEN
    // ------------------------------
    public String generateAccessToken(Integer userId, String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenValidityMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ------------------------------
    // EXTRACT EMAIL (SUBJECT)
    // ------------------------------
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // ------------------------------
    // GENERAL CLAIM EXTRACTOR
    // ------------------------------
    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    // ------------------------------
    // VALIDATION
    // ------------------------------
    public boolean isTokenValid(String token, org.springframework.security.core.userdetails.UserDetails userDetails) {
        String email = extractEmail(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // ------------------------------
    // PARSE TOKEN
    // ------------------------------
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
