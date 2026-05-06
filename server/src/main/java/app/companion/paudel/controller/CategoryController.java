package app.companion.paudel.controller;

import app.companion.paudel.dto.CategoryDto;
import app.companion.paudel.dto.CreateCategoryRequest;
import app.companion.paudel.service.CategoryService;
import app.companion.paudel.util.AuthUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/{version}/companion/categories", version = "v1")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final AuthUtils authUtils;

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        Integer ownerId = authUtils.currentUserId();
        CategoryDto dto = categoryService.createCategory(request, ownerId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/mine")
    public ResponseEntity<Page<CategoryDto>> myCategories(Pageable pageable) {
        Integer ownerId = authUtils.currentUserId();
        return ResponseEntity.ok(categoryService.listMyCategories(ownerId, pageable));
    }
}

