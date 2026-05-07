package app.companion.paudel.service.impl;

import app.companion.paudel.dto.DocumentDto;
import app.companion.paudel.exceptions.BadRequestException;
import app.companion.paudel.exceptions.TooManyDocumentsException;
import app.companion.paudel.model.Category;
import app.companion.paudel.model.Document;
import app.companion.paudel.model.Role;
import app.companion.paudel.model.User;
import app.companion.paudel.repository.CategoryRepository;
import app.companion.paudel.repository.DocumentRepository;
import app.companion.paudel.repository.UserRepository;
import app.companion.paudel.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private static final long MAX_DOCUMENTS_PER_CATEGORY = 10;
    private static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

    private final DocumentRepository documentRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Override
    public DocumentDto uploadDocument(Long categoryId, MultipartFile file, Integer ownerId) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BadRequestException("File too large");
        }

        String contentType = file.getContentType();
        if (contentType == null ||
                !(contentType.equals("application/pdf") ||
                  contentType.equals("application/msword") ||
                  contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {
            throw new BadRequestException("Unsupported file type. Only pdf, doc and docx allowed");
        }

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BadRequestException("Category not found"));

        long count = documentRepository.countByCategoryId(categoryId);
        if (count >= MAX_DOCUMENTS_PER_CATEGORY) {
            throw new TooManyDocumentsException("Category already has maximum documents");
        }
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new BadRequestException("Owner not found"));

        byte[] data;
        try {
            data = file.getBytes();
        } catch (IOException e) {
            throw new RuntimeException("Error reading file", e);
        }
        Document doc = Document.builder()
                .filename(file.getOriginalFilename())
                .contentType(contentType)
                .size(file.getSize())
                .data(data)
                .category(category)
                .owner(owner)
                .build();
        Document saved = documentRepository.save(doc);
        return toDto(saved);
    }

    @Override
    public Page<DocumentDto> listMyDocuments(Integer ownerId, Long categoryId, Pageable pageable) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new BadRequestException("Owner not found"));

        return documentRepository.findByOwnerIdAndCategoryId(owner.getId(), categoryId, pageable)
                .map(this::toDto);
    }

    @Override
    public Page<DocumentDto> listAllDocuments(Pageable pageable) {
        return documentRepository.findAll(pageable)
                .map(this::toDto);
    }

    @Override
    public byte[] downloadDocument(Long documentId, Integer requesterId) {
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new BadRequestException("Document not found"));
        return doc.getData();
    }

    @Override
    public Page<DocumentDto> listAdminDocuments(Pageable pageable) {
        return documentRepository.findByOwnerRole(Role.ADMIN, pageable)
                .map(this::toDto);
    }

    @Override
    public DocumentDto getDocument(Long documentId, Integer requesterId) {
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new BadRequestException("Document not found"));
        return toDto(doc);
    }

    private DocumentDto toDto(Document d) {
        return DocumentDto.builder()
                .id(d.getId())
                .filename(d.getFilename())
                .contentType(d.getContentType())
                .size(d.getSize())
                .categoryId(d.getCategory().getId())
                .ownerId(d.getOwner().getId())
                .createdAt(d.getCreatedAt())
                .build();
    }
}
