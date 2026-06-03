package app.companion.paudel.controller;

import app.companion.paudel.dto.AIRequest;
import app.companion.paudel.dto.DocumentDto;
import app.companion.paudel.service.DocumentService;
import app.companion.paudel.util.AuthUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(value = "/api/{version}/companion/documents", version = "v1")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final AuthUtils authUtils;

    @PostMapping("/upload/{categoryId}")
    public ResponseEntity<DocumentDto> upload(@PathVariable Long categoryId, @RequestParam("file") MultipartFile file) {
        Integer ownerId = authUtils.currentUserId();
        DocumentDto dto = documentService.uploadDocument(categoryId, file, ownerId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/mine/{categoryId}")
    public ResponseEntity<Page<DocumentDto>> myDocuments(@PathVariable Long categoryId, Pageable pageable) {
        Integer ownerId = authUtils.currentUserId();
        return ResponseEntity.ok(documentService.listMyDocuments(ownerId, categoryId, pageable));
    }

    @GetMapping("/all")
    public ResponseEntity<Page<DocumentDto>> allDocuments(Pageable pageable) {
        return ResponseEntity.ok(documentService.listAllDocuments(pageable));
    }

    // one uploaded by role ADMIN
    @GetMapping("/admin")
    public ResponseEntity<Page<DocumentDto>> adminDocuments(Pageable pageable) {
        return ResponseEntity.ok(documentService.listAdminDocuments(pageable));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<ByteArrayResource> download(@PathVariable Long id) {
        Integer ownerId = authUtils.currentUserId();
        byte[] data = documentService.downloadDocument(id, ownerId);
        ByteArrayResource resource = new ByteArrayResource(data);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=download")
                .contentLength(data.length)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<ByteArrayResource> view(@PathVariable Long id) {
        Integer ownerId = authUtils.currentUserId();
        DocumentDto doc = documentService.getDocument(id, ownerId);
        byte[] data = documentService.downloadDocument(id, ownerId);
        ByteArrayResource resource = new ByteArrayResource(data);
        
        // Determine content type from document
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        try {
            mediaType = MediaType.parseMediaType(doc.getContentType());
        } catch (Exception e) {
            log.info("Could not parse content type {}, defaulting to application/octet-stream and error message is {}", doc.getContentType(), e.getMessage());
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getFilename() + "\"")
                .contentLength(data.length)
                .contentType(mediaType)
                .body(resource);
    }

    // Search the documents using RAG pipeline and return the relevant documents based on the query
    @PostMapping("/ask-ai")
    public ResponseEntity<String> askAI(@RequestBody AIRequest request) {
        List<Document> chunks = documentService.getResponseFromAI(request.question(), request.documentId());
        String result = documentService.getFormattedResponseFromAI(chunks, request.question());
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(result);
    }
}
