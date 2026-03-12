package com.board.service;

import com.board.dto.CaptureDto;
import com.board.dto.CommentDto;
import com.board.dto.PostDto;
import com.board.entity.Capture;
import com.board.entity.Post;
import com.board.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public Page<PostDto> getPosts(String keyword, Pageable pageable) {
        return postRepository.searchByKeyword(keyword, pageable)
                .map(this::toDto);
    }

    @Transactional(readOnly = true)
    public PostDto getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + id));
        return toDto(post);
    }

    @Transactional
    public PostDto createPost(PostDto dto, List<MultipartFile> files) {
        Post post = Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .author(dto.getAuthor() != null ? dto.getAuthor() : "익명")
                .build();

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String storedFileName = fileStorageService.storeFile(file);
                    Capture capture = Capture.builder()
                            .post(post)
                            .filePath(storedFileName)
                            .originalFileName(file.getOriginalFilename())
                            .contentType(file.getContentType())
                            .fileSize(file.getSize())
                            .build();
                    post.getCaptures().add(capture);
                }
            }
        }

        post = postRepository.save(post);
        return toDto(post);
    }

    @Transactional
    public PostDto updatePost(Long id, PostDto dto, List<MultipartFile> newFiles) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + id));

        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        if (dto.getAuthor() != null) {
            post.setAuthor(dto.getAuthor());
        }

        if (newFiles != null && !newFiles.isEmpty()) {
            for (MultipartFile file : newFiles) {
                if (!file.isEmpty()) {
                    String storedFileName = fileStorageService.storeFile(file);
                    Capture capture = Capture.builder()
                            .post(post)
                            .filePath(storedFileName)
                            .originalFileName(file.getOriginalFilename())
                            .contentType(file.getContentType())
                            .fileSize(file.getSize())
                            .build();
                    post.getCaptures().add(capture);
                }
            }
        }

        post = postRepository.save(post);
        return toDto(post);
    }

    @Transactional
    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new IllegalArgumentException("게시글을 찾을 수 없습니다: " + id);
        }
        postRepository.deleteById(id);
    }

    private PostDto toDto(Post post) {
        List<CaptureDto> captureDtos = post.getCaptures().stream()
                .map(c -> CaptureDto.builder()
                        .id(c.getId())
                        .filePath(c.getFilePath())
                        .originalFileName(c.getOriginalFileName())
                        .contentType(c.getContentType())
                        .fileSize(c.getFileSize())
                        .build())
                .collect(Collectors.toList());

        List<CommentDto> commentDtos = post.getComments().stream()
                .map(c -> CommentDto.builder()
                        .id(c.getId())
                        .postId(c.getPost().getId())
                        .content(c.getContent())
                        .author(c.getAuthor())
                        .createdAt(c.getCreatedAt())
                        .updatedAt(c.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        return PostDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .author(post.getAuthor())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .captures(captureDtos)
                .comments(commentDtos)
                .build();
    }
}
