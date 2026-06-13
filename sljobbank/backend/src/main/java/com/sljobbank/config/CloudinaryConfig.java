package com.sljobbank.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

// ── Configuration ─────────────────────────────────────────────
@Configuration
class CloudinaryConfig {
    @Value("${cloudinary.cloud-name}") private String cloudName;
    @Value("${cloudinary.api-key}")    private String apiKey;
    @Value("${cloudinary.api-secret}") private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key",    apiKey,
            "api_secret", apiSecret,
            "secure",     true
        ));
    }
}

// ── Upload Service ────────────────────────────────────────────
@Service
class CloudinaryService {
    private final Cloudinary cloudinary;
    CloudinaryService(Cloudinary c) { this.cloudinary = c; }

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(),
            ObjectUtils.asMap("folder", "sljobbank/" + folder, "resource_type", "auto"));
        return (String) result.get("secure_url");
    }

    public String uploadPdf(byte[] data, String filename) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(data,
            ObjectUtils.asMap("folder", "sljobbank/reports", "public_id", filename,
                "resource_type", "raw", "format", "pdf"));
        return (String) result.get("secure_url");
    }

    public void delete(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
