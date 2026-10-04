package pgmanagement.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pgmanagement.dto.LoginRequest;
import pgmanagement.security.AdminAuthFilter;
import pgmanagement.service.AdminService;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;
    private final AdminAuthFilter authFilter;

    public AdminController(
            AdminService adminService,
            AdminAuthFilter authFilter
    ) {
        this.adminService = adminService;
        this.authFilter = authFilter;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        if (!adminService.validate(request.username(), request.password())) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Invalid username or password")
            );
        }

        String token = authFilter.createToken();

        return ResponseEntity.ok(Map.of(
                "token", token,
                "username", request.username(),
                "message", "Login successful"
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String token = (String) request.getAttribute("adminToken");
        authFilter.removeToken(token);

        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully")
        );
    }
}