package pgmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pgmanagement.entity.Enquiry;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {}