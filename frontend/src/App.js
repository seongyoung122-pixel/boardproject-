import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import PostWrite from './pages/PostWrite';
import PostEdit from './pages/PostEdit';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/write" element={<PostWrite />} />
          <Route path="/posts/:id/edit" element={<PostEdit />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
