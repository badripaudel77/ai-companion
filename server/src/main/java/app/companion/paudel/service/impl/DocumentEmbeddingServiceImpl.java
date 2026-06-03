package app.companion.paudel.service.impl;

import app.companion.paudel.model.UserDocument;
import app.companion.paudel.service.DocumentEmbeddingService;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class DocumentEmbeddingServiceImpl implements DocumentEmbeddingService {

    private final VectorStore vectorStore;
    private final TokenTextSplitter tokenTextSplitter = TokenTextSplitter.builder()
            .withChunkSize(800)                  // Target token count per chunk
            .withMinChunkSizeChars(100)          // Look for break point after this many chars
            .withMinChunkLengthToEmbed(5)        // Drop chunks shorter than this length
            .withMaxNumChunks(10000)             // Safeguard boundary cap per file
            .withKeepSeparator(true)             // Retain delimiters (like newlines)
            .build();

    @Autowired
    public DocumentEmbeddingServiceImpl(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    @Override
    public void processAndStore(UserDocument document, MultipartFile file) {
        try {
            // Convert MultipartFile to a Spring Resource wrapper
            Resource resource = new InputStreamResource(file.getInputStream());
            String contentType = file.getContentType();
            if (contentType == null) {
                throw new RuntimeException("Unknown file type");
            }

            // Select the native Spring AI reader based on the content type
            List<Document> rawDocuments;
            if (contentType.equals("application/pdf")) {
                PagePdfDocumentReader pdfReader = new PagePdfDocumentReader(resource);
                rawDocuments = pdfReader.get();
            }
            else if (contentType.equals("application/msword") || contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
                // Spring AI Tika Reader automatically handles both older .doc and newer .docx
                TikaDocumentReader tikaReader = new TikaDocumentReader(resource);
                rawDocuments = tikaReader.get();
            }
            else {
                throw new RuntimeException("Unsupported file type: " + contentType);
            }

            // Inject custom database metadata into the read documents
            for (Document doc : rawDocuments) {
                doc.getMetadata().putAll(Map.of(
                        "documentId", document.getId(),
                        "filename", document.getFilename()
                ));
            }
            // Split and chunk using tokens
            List<Document> splitDocs = tokenTextSplitter.apply(rawDocuments);

            // Save  to Vector Database (Pgvector) - Spring AI will handle the embedding and storage in one step
            vectorStore.add(splitDocs);
        }
        catch (IOException e) {
            throw new RuntimeException("Failed to process and embed document", e);
        }
    }
}