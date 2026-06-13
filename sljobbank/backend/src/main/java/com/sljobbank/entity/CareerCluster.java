package com.sljobbank.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "career_clusters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({
        "hibernateLazyInitializer",
        "handler"
})
public class CareerCluster {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false) private String name;
    @Column(columnDefinition = "TEXT") private String description;
    private String image;
    private String emoji;
    private String color;

    @OneToMany(mappedBy = "cluster", cascade = CascadeType.ALL)
    @JsonIgnore
    @Builder.Default
    private List<Job> jobs = new ArrayList<>();
}
