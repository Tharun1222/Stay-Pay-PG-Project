package pgmanagement.service;

import org.springframework.stereotype.Service;
import pgmanagement.entity.FoodTrial;
import pgmanagement.repository.FoodTrialRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class FoodTrialService {
    private final FoodTrialRepository repository;

    private static final Set<String> STATUSES =
            Set.of("PENDING", "CONFIRMED", "COMPLETED", "CANCELLED");

    public FoodTrialService(FoodTrialRepository repository) {
        this.repository = repository;
    }

    public FoodTrial create(FoodTrial trial) {
        if (trial.getName() == null || trial.getName().isBlank() ||
            trial.getEmail() == null || trial.getEmail().isBlank() ||
            trial.getPhone() == null ||
            !trial.getPhone().matches("[6-9][0-9]{9}") ||
            trial.getFoodPreference() == null ||
            trial.getAddress() == null || trial.getAddress().isBlank() ||
            trial.getTrialDate() == null ||
            trial.getTrialDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Invalid food trial details");
        }

        trial.setId(null);
        trial.setStatus("PENDING");
        return repository.save(trial);
    }

    public List<FoodTrial> getAll() {
        return repository.findAll();
    }

    public FoodTrial updateStatus(Long id, String status) {
        if (!STATUSES.contains(status)) {
            throw new IllegalArgumentException("Invalid food trial status");
        }

        FoodTrial trial = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food trial not found"));

        trial.setStatus(status);
        return repository.save(trial);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}