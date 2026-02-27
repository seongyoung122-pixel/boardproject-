package com.board.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaptureDto {

    private Long id;
    private String filePath;
    private String originalFileName;
    private String contentType;
    private Long fileSize;
}
