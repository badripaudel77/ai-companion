package app.companion.paudel.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class CategoryDto {
    private Long id;
    private String name;
    private String description;
    private Integer ownerId;
    private Instant createdAt;
}

