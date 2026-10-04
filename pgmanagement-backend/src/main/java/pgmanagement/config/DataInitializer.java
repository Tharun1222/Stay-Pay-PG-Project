package pgmanagement.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pgmanagement.entity.Franchise;
import pgmanagement.service.AdminService;
import pgmanagement.repository.FranchiseRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeData(
            AdminService adminService,
            FranchiseRepository franchiseRepository
    ) {
        return args -> {
            adminService.createDefaultAdmin();

            if (franchiseRepository.count() == 0) {
                Franchise franchise = new Franchise();
                franchise.setName("StayNest Food Partner");
                franchise.setAddress("Chennai, Tamil Nadu");
                franchise.setPhone("9876543210");
                franchise.setFoodType("Vegetarian and Non-Vegetarian");
                franchise.setLatitude(13.0827);
                franchise.setLongitude(80.2707);
                franchise.setActive(true);
                franchiseRepository.save(franchise);
            }
        };
    }
}