package pgmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pgmanagement.entity.Franchise;

public interface FranchiseRepository extends JpaRepository<Franchise, Long> {}