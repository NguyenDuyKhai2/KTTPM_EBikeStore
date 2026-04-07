package com.ebike.shared.controller;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLConnection;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/media")
public class MediaProxyController {

    private final HttpClient httpClient = HttpClient.newBuilder()
        .followRedirects(HttpClient.Redirect.NORMAL)
        .build();

    @GetMapping("/image")
    public ResponseEntity<byte[]> proxyImage(@RequestParam String url) {
        URI remoteUri = parseAndValidate(url);

        try {
            HttpRequest request = HttpRequest.newBuilder(remoteUri)
                .header(HttpHeaders.USER_AGENT, "Mozilla/5.0 EBikeMediaProxy/1.0")
                .GET()
                .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            if (response.statusCode() >= 400) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Unable to fetch remote image");
            }

            String contentType = response.headers()
                .firstValue(HttpHeaders.CONTENT_TYPE)
                .orElseGet(() -> URLConnection.guessContentTypeFromName(remoteUri.getPath()));

            MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
            if (contentType != null && !contentType.isBlank()) {
                try {
                    mediaType = MediaType.parseMediaType(contentType);
                } catch (Exception ignored) {
                    mediaType = MediaType.APPLICATION_OCTET_STREAM;
                }
            }

            return ResponseEntity.ok()
                .contentType(mediaType)
                .cacheControl(CacheControl.noCache())
                .body(response.body());
        } catch (IOException | InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Unable to proxy image", exception);
        }
    }

    private URI parseAndValidate(String rawUrl) {
        try {
            URI uri = new URI(rawUrl);
            String scheme = uri.getScheme();
            String host = uri.getHost();

            if (scheme == null || (!"http".equalsIgnoreCase(scheme) && !"https".equalsIgnoreCase(scheme))) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid image URL scheme");
            }
            if (host == null || host.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid image URL host");
            }
            if (host.equalsIgnoreCase("localhost") || host.startsWith("127.") || host.startsWith("192.168.") || host.startsWith("10.")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Blocked image host");
            }

            return uri;
        } catch (URISyntaxException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Malformed image URL", exception);
        }
    }
}
