package app.companion.paudel.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class DocumentDto {
    private Long id;
    private String filename;
    private String contentType;
    private Long size;
    private Long categoryId;
    private Integer ownerId;
    private Instant createdAt;
}

