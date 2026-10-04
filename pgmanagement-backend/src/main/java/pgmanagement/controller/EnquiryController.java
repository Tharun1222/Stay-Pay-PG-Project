package pgmanagement.controller;

import org.springframework.web.bind.annotation.*;
import pgmanagement.entity.Enquiry;
import pgmanagement.service.EnquiryService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {
    private final EnquiryService service;

    public EnquiryController(EnquiryService service) {
        this.service = service;
    }

    @PostMapping
    public Enquiry create(@RequestBody Enquiry enquiry) {
        return service.create(enquiry);
    }

    @GetMapping
    public List<Enquiry> getAll() {
        return service.getAll();
    }

    @PatchMapping("/{id}/status")
    public Enquiry updateStatus(
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