package com.board.service;

import com.board.dto.CommentDto;
import com.board.entity.Comment;
import com.board.entity.Post;
import com.board.repository.CommentRepository;
import com.board.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public List<CommentDto> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
        return comments.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentDto createComment(Long postId, CommentDto dto) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + postId));

        Comment comment = Comment.builder()
                .post(post)
                .content(dto.getContent())
                .author(dto.getAuthor() != null ? dto.getAuthor() : "익명")
                .build();

        comment = commentRepository.save(comment);
        return toDto(comment);
    }

    @Transactional
    public CommentDto updateComment(Long id, CommentDto dto) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다: " + id));

        comment.setContent(dto.getContent());
        if (dto.getAuthor() != null) {
            comment.setAuthor(dto.getAuthor());
        }

        comment = commentRepository.save(comment);
        return toDto(comment);
    }

    @Transactional
    public void deleteComment(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new IllegalArgumentException("댓글을 찾을 수 없습니다: " + id);
        }
        commentRepository.deleteById(id);
    }

    private CommentDto toDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .content(comment.getContent())
                .author(comment.getAuthor())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
