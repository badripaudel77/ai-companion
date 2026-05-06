package app.companion.paudel.util;

public class SecurityConstants {

    public static final String[] PUBLIC_ENDPOINTS = {
            "/api/v1/companion/auth/**",
            "/v2/api-docs/**",
            "/v3/api-docs/**",
            "/swagger-resources/**",
            "/configuration/**",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html"
    };
}
