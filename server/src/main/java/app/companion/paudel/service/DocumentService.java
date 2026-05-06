package app.companion.paudel.service;

import app.companion.paudel.dto.DocumentDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface DocumentService {
    DocumentDto uploadDocument(Long categoryId, MultipartFile file, Integer ownerId);

    Page<DocumentDto> listMyDocuments(Integer ownerId, Pageable pageable);

    Page<DocumentDto> listAllDocuments(Pageable pageable);

    byte[] downloadDocument(Long documentId, Integer requesterId);

    Page<DocumentDto> listAdminDocuments(Pageable pageable);
}
