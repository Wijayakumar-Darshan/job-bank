package com.sljobbank.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity @Table(name = "institutes")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Institute {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(nullable = false) private String name;
    private String logo;
    private String location;
    private String contact;
    private String website;
    private String accreditation;
    private String type; // govt, private, professional

    @OneToMany(mappedBy = "institute", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Course> courses = new ArrayList<>();
}
