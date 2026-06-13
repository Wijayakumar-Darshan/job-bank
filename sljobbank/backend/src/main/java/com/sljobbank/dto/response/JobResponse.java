package com.sljobbank.dto.response;
import lombok.Builder;
import lombok.Data;
import java.util.List;
@Data
@Builder
public class JobResponse {

    private String id;
    private String title;
    private String description;

    private List<QualificationDto> qualifications;

    private String skills;
    private String alStream;
    private String alSubjects;
    private String industryDemand;
    private String careerPathway;
    private String employmentGrowth;
    private String sector;
    private String image;

    private Double salaryMin;
    private Double salaryMax;

    private Boolean remoteAvailable;
    private Boolean internshipAvailable;

    private String clusterId;
    private String clusterName;
    private String clusterEmoji;
    private String clusterColor;

    private List<CourseDto> courses;

    @Data
    @Builder
    public static class QualificationDto {
        private String id;
        private String name;
    }

    @Data
    @Builder
    public static class CourseDto {
        private String id;
        private String name;
        private String duration;
        private String qualification;
        private String deliveryMode;
        private Double fee;
        private String instituteName;
        private String instituteId;
    }
}