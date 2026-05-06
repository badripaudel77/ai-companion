package app.companion.paudel.service;

import app.companion.paudel.dto.CategoryDto;
import app.companion.paudel.dto.CreateCategoryRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService {
    CategoryDto createCategory(CreateCategoryRequest request, Integer ownerId);

    Page<CategoryDto> listMyCategories(Integer ownerId, Pageable pageable);

    // other methods can be added later
}

