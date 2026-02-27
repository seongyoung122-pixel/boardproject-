import axios from 'axios';

const API_BASE = '/api';

export const getPosts = (params = {}) => {
  return axios.get(`${API_BASE}/posts`, { params });
};

export const getPost = (id) => {
  return axios.get(`${API_BASE}/posts/${id}`);
};

export const createPost = (formData) => {
  return axios.post(`${API_BASE}/posts`, formData);
};

export const updatePost = (id, formData) => {
  return axios.put(`${API_BASE}/posts/${id}`, formData);
};

export const deletePost = (id) => {
  return axios.delete(`${API_BASE}/posts/${id}`);
};

export const getCaptureUrl = (fileName) => {
  return `${API_BASE}/posts/captures/${fileName}`;
};
