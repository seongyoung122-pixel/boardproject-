import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="logo">
          📸 캡처 기반 게시판
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">목록</Link>
          <Link to="/write" className="nav-link write">글쓰기</Link>
        </nav>
      </header>
      <main className="main">
        {children}
      </main>
      <footer className="footer">
        <p>© 2025 캡처 기반 게시판 프로젝트</p>
      </footer>
    </div>
  );
}

export default Layout;
