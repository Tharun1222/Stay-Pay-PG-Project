package pgmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pgmanagement.entity.FoodTrial;

public interface FoodTrialRepository extends JpaRepository<FoodTrial, Long> {}