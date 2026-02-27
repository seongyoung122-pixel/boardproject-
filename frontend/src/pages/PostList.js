import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../api/postApi';
import './PostList.css';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPosts = async (pageNum = 0, searchKeyword = keyword) => {
    setLoading(true);
    try {
      const { data } = await getPosts({
        page: pageNum,
        size: 10,
        keyword: searchKeyword || undefined,
      });
      setPosts(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('게시글 목록 조회 실패:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page, keyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(0);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="post-list">
      <div className="page-header">
        <h1>게시글 목록</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="제목, 내용, 작성자 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">검색</button>
        </form>
      </div>

      {loading ? (
        <div className="loading">로딩 중...</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <p>등록된 게시글이 없습니다.</p>
          <Link to="/write" className="empty-link">첫 글 작성하기</Link>
        </div>
      ) : (
        <>
          <div className="post-table">
            <div className="table-header">
              <span className="col-id">번호</span>
              <span className="col-title">제목</span>
              <span className="col-author">작성자</span>
              <span className="col-date">작성일</span>
            </div>
            {posts.map((post) => (
              <Link to={`/posts/${post.id}`} key={post.id} className="post-row">
                <span className="col-id">{post.id}</span>
                <span className="col-title">
                  {post.title}
                  {post.captures?.length > 0 && (
                    <span className="capture-badge">📷 {post.captures.length}</span>
                  )}
                </span>
                <span className="col-author">{post.author}</span>
                <span className="col-date">{formatDate(post.createdAt)}</span>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                이전
              </button>
              <span className="page-info">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PostList;
