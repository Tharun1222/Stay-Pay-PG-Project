
package pgmanagement.security;

import java.io.IOException;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AdminAuthFilter extends OncePerRequestFilter {

    private static final Set<String> TOKENS =
            ConcurrentHashMap.newKeySet();

    private static final Set<String> ALLOWED_ORIGINS = Set.of(
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175"
    );

    public static String createToken() {
        String token = UUID.randomUUID().toString();
        TOKENS.add(token);
        return token;
    }

    public static void removeToken(String token) {
        if (token != null) {
            TOKENS.remove(token);
        }
    }

    public static boolean isValid(String token) {
        return token != null && TOKENS.contains(token);
    }

    private void addCorsHeaders(
            HttpServletRequest request,
            HttpServletResponse response) {

        String origin = request.getHeader("Origin");

        if (origin != null && ALLOWED_ORIGINS.contains(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.addHeader("Vary", "Origin");
        }

        response.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        );

        response.setHeader(
                "Access-Control-Allow-Headers",
                "Authorization, Content-Type, Accept, Origin"
        );

        response.setHeader("Access-Control-Max-Age", "3600");
    }

    private boolean isPublicRoute(
            HttpServletRequest request,
            String path,
            String method) {

        if ("POST".equals(method)
                && "/api/admin/login".equals(path)) {
            return true;
        }

        if ("GET".equals(method)
                && ("/api/rooms".equals(path)
                || path.matches("/api/rooms/\\d+"))) {
            return true;
        }

        if ("POST".equals(method)
                && "/api/enquiries".equals(path)) {
            return true;
        }

        if ("POST".equals(method)
                && "/api/food-trials".equals(path)) {
            return true;
        }

        if ("GET".equals(method)
                && "/api/franchises/nearby".equals(path)) {
            return true;
        }

        return false;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Add CORS headers before authentication checks
        addCorsHeaders(request, response);

        String method = request.getMethod();
        String path = request.getServletPath();

        // Allow browser preflight requests without authentication
        if ("OPTIONS".equalsIgnoreCase(method)) {
            response.setStatus(HttpServletResponse.SC_NO_CONTENT);
            return;
        }

        // Allow public API routes
        if (isPublicRoute(request, path, method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Read admin token from Authorization header
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendUnauthorized(response);
            return;
        }

        String token = authHeader.substring(7).trim();

        if (!isValid(token)) {
            sendUnauthorized(response);
            return;
        }

        // Make the authenticated token available to controllers
        request.setAttribute("adminToken", token);

        filterChain.doFilter(request, response);
    }

    private void sendUnauthorized(HttpServletResponse response)
            throws IOException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.getWriter().write(
                "{\"message\":\"Unauthorized. Please login again.\"}"
        );
    }
}