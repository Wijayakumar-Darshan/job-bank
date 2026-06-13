package com.sljobbank.dto.request;

import com.sljobbank.entity.Job;
import lombok.Data;

import java.util.List;

@Data
public class JobRequest {
    private Job job;
    private List<String> qualificationIds;
    private String clusterId;
}
