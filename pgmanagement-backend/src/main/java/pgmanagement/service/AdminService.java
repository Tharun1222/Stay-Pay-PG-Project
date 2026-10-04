
package pgmanagement.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import pgmanagement.entity.Admin;
import pgmanagement.repository.AdminRepository;

@Service
public class AdminService {

    private final AdminRepository repository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AdminService(AdminRepository repository) {
        this.repository = repository;
    }

    public boolean validate(String username, String password) {
        return repository.findByUsername(username)
                .map(admin -> encoder.matches(password, admin.getPassword()))
                .orElse(false);
    }

    public void createDefaultAdmin() {
        if (repository.findByUsername("admin").isEmpty()) {
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword(encoder.encode("admin123"));
            repository.save(admin);
        }
    }
}

