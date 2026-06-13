package com.sljobbank.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({
        "hibernateLazyInitializer",
        "handler"
})
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String responsibilities;

    @Column(columnDefinition = "TEXT")
    private String skills;

    private String alStream;

    @Column(columnDefinition = "TEXT")
    private String alSubjects;

    private Double salaryMin;

    private Double salaryMax;

    private String industryDemand;

    @Column(columnDefinition = "TEXT")
    private String careerPathway;

    private String employmentGrowth;

    private String sector;

    private Boolean remoteAvailable;

    private Boolean internshipAvailable;

    private String image;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cluster_id", nullable = false)
    private CareerCluster cluster;

    @ManyToMany
    @JoinTable(
            name = "job_qualifications",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "qualification_id")
    )
    @Builder.Default
    private List<Qualification> qualifications = new ArrayList<>();

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    @JsonIgnore
    @Builder.Default
    private List<Favorite> favorites = new ArrayList<>();

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    @JsonIgnore
    @Builder.Default
    private List<StudentView> views = new ArrayList<>();
}