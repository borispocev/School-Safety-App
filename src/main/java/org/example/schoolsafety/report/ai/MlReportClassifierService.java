package org.example.schoolsafety.report.ai;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class MlReportClassifierService {

    private static final String ML_SERVICE_URL = "http://localhost:8001/classify-report";

    private final RestClient restClient;

    public MlReportClassifierService(RestClient restClient) {
        this.restClient = restClient;
    }

    public MlClassificationResponse classify(String title, String description, String locationDetails) {
        MlClassificationRequest request = new MlClassificationRequest(
                title,
                description,
                locationDetails
        );

        return restClient.post()
                .uri(ML_SERVICE_URL)
                .body(request)
                .retrieve()
                .body(MlClassificationResponse.class);
    }
}