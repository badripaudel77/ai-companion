package app.companion.paudel.service.impl;

import app.companion.paudel.dto.CategoryDto;
import app.companion.paudel.dto.CreateCategoryRequest;
import app.companion.paudel.exceptions.BadRequestException;
import app.companion.paudel.model.Category;
import app.companion.paudel.model.User;
import app.companion.paudel.repository.CategoryRepository;
import app.companion.paudel.repository.UserRepository;
import app.companion.paudel.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Override
    public CategoryDto createCategory(CreateCategoryRequest request, Integer ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new BadRequestException("Owner not found"));

        categoryRepository.findByNameAndOwner(request.getName(), owner).ifPresent(c -> {
            throw new BadRequestException("Category with same name already exists");
        });

        Category cat = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(owner)
                .build();

        Category saved = categoryRepository.save(cat);
        return toDto(saved);
    }

    @Override
    public Page<CategoryDto> listMyCategories(Integer ownerId, Pageable pageable) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new BadRequestException("Owner not found"));

        return categoryRepository.findByOwner(owner, pageable)
                .map(this::toDto);
    }

    private CategoryDto toDto(Category cat) {
        return CategoryDto.builder()
                .id(cat.getId())
                .name(cat.getName())
                .description(cat.getDescription())
                .ownerId(cat.getOwner().getId())
                .createdAt(cat.getCreatedAt())
                .build();
    }
}

