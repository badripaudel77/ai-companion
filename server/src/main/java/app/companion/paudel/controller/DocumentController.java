package app.companion.paudel.controller;

import app.companion.paudel.dto.DocumentDto;
import app.companion.paudel.service.DocumentService;
import app.companion.paudel.util.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
        // In a real app we should return original filename and content type
        ByteArrayResource resource = new ByteArrayResource(data);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=download")
                .contentLength(data.length)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
