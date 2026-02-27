package com.board.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "captures")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Capture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(nullable = false, length = 500)
    private String filePath;

    @Column(length = 255)
    private String originalFileName;

    @Column(length = 100)
    private String contentType;

    private Long fileSize;
}
