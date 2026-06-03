package app.companion.paudel.service.impl;

import app.companion.paudel.dto.DocumentDto;
import app.companion.paudel.exceptions.BadRequestException;
import app.companion.paudel.exceptions.TooManyDocumentsException;
import app.companion.paudel.model.Category;
import app.companion.paudel.model.UserDocument;
import app.companion.paudel.model.Role;
import app.companion.paudel.model.User;
import app.companion.paudel.repository.CategoryRepository;
import app.companion.paudel.repository.DocumentRepository;
import app.companion.paudel.repository.UserRepository;
import app.companion.paudel.service.DocumentEmbeddingService;
import app.companion.paudel.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private static final long MAX_DOCUMENTS_PER_CATEGORY = 10;
    private static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

    private final DocumentRepository documentRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final DocumentEmbeddingService documentEmbeddingService;
    private final VectorStore vectorStore;
    private final ChatClient chatClient;

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
        UserDocument doc = UserDocument.builder()
                .filename(file.getOriginalFilename())
                .contentType(contentType)
                .size(file.getSize())
                .data(data)
                .category(category)
                .owner(owner)
                .build();
        UserDocument savedDoc = documentRepository.save(doc);
        // RAG Pipeline HOOK : process it for embedding and store the vectors in the vector store
        documentEmbeddingService.processAndStore(savedDoc, file);
        return toDto(savedDoc);
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
        UserDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new BadRequestException("UserDocument not found"));
        return doc.getData();
    }

    @Override
    public Page<DocumentDto> listAdminDocuments(Pageable pageable) {
        return documentRepository.findByOwnerRole(Role.ADMIN, pageable)
                .map(this::toDto);
    }

    @Override
    public DocumentDto getDocument(Long documentId, Integer requesterId) {
        UserDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new BadRequestException("UserDocument not found"));
        return toDto(doc);
    }

    // Link to DOC: https://docs.spring.io/spring-ai/reference/api/vectordbs/pgvector.html
    @Override
    public List<Document> getResponseFromAI(String question, Long documentId) {
        FilterExpressionBuilder b = new FilterExpressionBuilder();
        return vectorStore.similaritySearch(SearchRequest.builder()
                .query(question)
                .topK(5)
                .filterExpression(
                        b.eq("documentId", documentId).build()
                )
                .build()
        );
    }

    @Override
    public String getFormattedResponseFromAI(List<Document> chunks, String question) {
        String context = chunks.stream()
                .map(doc -> """
                        [Source Information]
                        File: %s
                        Page: %s
                        Content:
                        %s
                        """.formatted(
                        doc.getMetadata().get("filename"),
                        doc.getMetadata().get("page_number"),
                        doc.getText()
                ))
                .collect(Collectors.joining("\n\n-------------------\n\n"));
        String prompt = """
                You are a helpful document assistant.
                Answer the user's question using ONLY the provided context.
                If the answer cannot be found in the context, respond exactly:
                "You're not aware of it."
                After answering, provide the reference page number(s).
                Output format:
                Answer:
                <answer>
                Reference Pages:
                <comma separated page numbers>
                Context:
                %s
                Question:
                %s
                """.formatted(context, question);

        return chatClient.prompt().user(prompt).call().content();
    }

    private DocumentDto toDto(UserDocument d) {
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
