package com.sljobbank.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "courses")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(nullable = false) private String name;
    private String duration;
    private Double fee;
    private String intakeDates;
    @Column(columnDefinition = "TEXT") private String description;
    private String deliveryMode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institute_id", nullable = false)
    private Institute institute;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "qualification_id")
    private Qualification qualification;
}
