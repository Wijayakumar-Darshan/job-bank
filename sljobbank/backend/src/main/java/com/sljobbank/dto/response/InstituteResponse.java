package com.sljobbank.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstituteResponse {
    private String id;
    private String name;
    private String logo;
    private String location;
    private String contact;
    private String website;
    private String accreditation;
    private String type;
    // You can add course count or summary if needed
}