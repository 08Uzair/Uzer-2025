import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:8810/api/v1" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

// BLOGS
export const fetchBlog = () => API.get("/blogPost/");
export const fetchBlogByID = (id) => API.get(`/blogPost/${id}`);
export const createBlog = (newBlog) => API.post("/blogPost/", newBlog);
export const deleteBlogById = (id) => API.delete(`/blogPost/${id}`);
export const updateBlogById = (id, updatedBlog) =>
  API.put(`/blogPost/${id}`, updatedBlog);

// CATEGORY
export const fetchCategories = () => API.get("/category/");
export const fetchCategoryById = (id) => API.get(`/category/${id}`);

// LIKES
export const toggleLike = (newLike) => API.post("/blogPost", newLike);

// AUTHOR
export const getAuthor = () => API.get("/user/");
export const getAuthorById = (id) => API.get(`/user/${id}`);
export const signUp = (newUser) => API.post("/user/signUp/", newUser);
export const signIn = (newUser) => API.post("/user/signIn/", newUser);
