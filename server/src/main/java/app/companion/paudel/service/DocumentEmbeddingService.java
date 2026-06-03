package app.companion.paudel.service;

import app.companion.paudel.model.UserDocument;
import org.springframework.web.multipart.MultipartFile;

public interface DocumentEmbeddingService {
    void processAndStore(UserDocument document, MultipartFile file);
}
