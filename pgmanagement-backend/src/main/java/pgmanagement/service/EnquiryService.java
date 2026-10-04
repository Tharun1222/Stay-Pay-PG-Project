package pgmanagement.service;

import org.springframework.stereotype.Service;
import pgmanagement.entity.Enquiry;
import pgmanagement.repository.EnquiryRepository;

import java.util.List;
import java.util.Set;

@Service
public class EnquiryService {
    private final EnquiryRepository repository;
    private static final Set<String> STATUSES =
            Set.of("PENDING", "CONTACTED", "APPROVED", "REJECTED");

    public EnquiryService(EnquiryRepository repository) {
        this.repository = repository;
    }

    public Enquiry create(Enquiry enquiry) {
        if (enquiry.getName() == null || enquiry.getName().isBlank() ||
            enquiry.getEmail() == null || enquiry.getEmail().isBlank() ||
            enquiry.getPhone() == null ||
            !enquiry.getPhone().matches("[6-9][0-9]{9}") ||
            enquiry.getProfession() == null ||
            enquiry.getPreferredRoom() == null) {
            throw new IllegalArgumentException("Invalid enquiry details");
        }

        enquiry.setId(null);
        enquiry.setStatus("PENDING");
        return repository.save(enquiry);
    }

    public List<Enquiry> getAll() {
        return repository.findAll();
    }

    public Enquiry updateStatus(Long id, String status) {
        if (!STATUSES.contains(status)) {
            throw new IllegalArgumentException("Invalid enquiry status");
        }

        Enquiry enquiry = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enquiry not found"));

        enquiry.setStatus(status);
        return repository.save(enquiry);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}