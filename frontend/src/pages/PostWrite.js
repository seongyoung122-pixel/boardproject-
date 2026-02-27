import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/postApi';
import './PostForm.css';

function PostWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', content.trim());
      if (author.trim()) formData.append('author', author.trim());
      files.forEach((file) => formData.append('files', file));

      const { data } = await createPost(formData);
      navigate(`/posts/${data.id}`);
    } catch (err) {
      console.error('글 작성 실패:', err);
      setError(err.response?.data?.message || '글 작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="post-form">
      <h1>글 작성</h1>
      <form onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        <div className="form-group">
          <label>제목 *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={200}
          />
        </div>
        <div className="form-group">
          <label>작성자</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="익명"
            maxLength={100}
          />
        </div>
        <div className="form-group">
          <label>내용 *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={10}
          />
        </div>
        <div className="form-group">
          <label>캡처/이미지 첨부</label>
          <div className="file-upload-area">
            <input
              type="file"
              id="file-input"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="file-input" className="file-label">
              📷 클릭하거나 파일을 드래그하여 캡처 이미지 첨부
            </label>
          </div>
          {files.length > 0 && (
            <div className="file-list">
              {files.map((file, i) => (
                <div key={i} className="file-item">
                  <span>{file.name}</span>
                  <button type="button" onClick={() => removeFile(i)} className="remove-file">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="form-actions">
          <button type="submit" disabled={submitting} className="btn-submit">
            {submitting ? '등록 중...' : '등록'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-cancel">
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostWrite;
