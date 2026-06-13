package com.sljobbank.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity @Table(name = "favorites")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Favorite {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @CreationTimestamp private LocalDateTime savedAt;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "job_id",  nullable = false) private Job  job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
}
