package app.companion.paudel.service;

import app.companion.paudel.dto.DocumentDto;
import org.springframework.ai.document.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {
    DocumentDto uploadDocument(Long categoryId, MultipartFile file, Integer ownerId);

    Page<DocumentDto> listMyDocuments(Integer ownerId, Long categoryId, Pageable pageable);

    Page<DocumentDto> listAllDocuments(Pageable pageable);

    byte[] downloadDocument(Long documentId, Integer requesterId);

    Page<DocumentDto> listAdminDocuments(Pageable pageable);

    DocumentDto getDocument(Long documentId, Integer requesterId);

    List<Document> getSimilarChunks(String question, Long documentId);

    String getFormattedResponseFromAI(List<Document> chunks, String question);
}
