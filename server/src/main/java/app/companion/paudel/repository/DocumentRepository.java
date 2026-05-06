package app.companion.paudel.repository;

import app.companion.paudel.model.Document;
import app.companion.paudel.model.Role;
import app.companion.paudel.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    long countByCategoryId(Long categoryId);

    Page<Document> findByOwner(User owner, Pageable pageable);

    Page<Document> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Document> findByOwnerRole(Role role, Pageable pageable);
}
