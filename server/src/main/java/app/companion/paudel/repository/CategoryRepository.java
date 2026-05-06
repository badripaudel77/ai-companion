package app.companion.paudel.repository;

import app.companion.paudel.model.Category;
import app.companion.paudel.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByNameAndOwner(String name, User owner);

    Page<Category> findByOwner(User owner, Pageable pageable);
}

