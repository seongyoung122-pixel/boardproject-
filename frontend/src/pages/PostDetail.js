import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, deletePost, getCaptureUrl } from '../api/postApi';
import './PostDetail.css';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getPost(id);
        setPost(data);
      } catch (err) {
        console.error('게시글 조회 실패:', err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    setDeleting(true);
    try {
      await deletePost(id);
      navigate('/');
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('ko-KR');
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (!post) return <div className="error">게시글을 찾을 수 없습니다.</div>;

  return (
    <article className="post-detail">
      <header className="post-header">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>{post.author}</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <div className="post-actions">
          <Link to={`/posts/${id}/edit`} className="btn btn-edit">수정</Link>
          <button onClick={handleDelete} disabled={deleting} className="btn btn-delete">
            {deleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </header>

      <div className="post-content">
        <pre>{post.content}</pre>
      </div>

      {post.captures && post.captures.length > 0 && (
        <section className="captures-section">
          <h3>📷 첨부 캡처 ({post.captures.length})</h3>
          <div className="capture-grid">
            {post.captures.map((capture) => (
              <div key={capture.id} className="capture-item">
                <img
                  src={getCaptureUrl(capture.filePath)}
                  alt={capture.originalFileName || '캡처'}
                  className="capture-image"
                />
                {capture.originalFileName && (
                  <p className="capture-filename">{capture.originalFileName}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="post-footer">
        <Link to="/" className="btn btn-back">목록으로</Link>
      </div>
    </article>
  );
}

export default PostDetail;
