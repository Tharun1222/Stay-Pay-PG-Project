package pgmanagement.controller;

import org.springframework.web.bind.annotation.*;
import pgmanagement.entity.FoodTrial;
import pgmanagement.service.FoodTrialService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/food-trials")
public class FoodTrialController {
    private final FoodTrialService service;

    public FoodTrialController(FoodTrialService service) {
        this.service = service;
    }

    @PostMapping
    public FoodTrial create(@RequestBody FoodTrial trial) {
        return service.create(trial);
    }

    @GetMapping
    public List<FoodTrial> getAll() {
        return service.getAll();
    }

    @PatchMapping("/{id}/status")
    public FoodTrial updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        return service.updateStatus(id, body.get("status"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}