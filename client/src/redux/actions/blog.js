import { toast } from "react-toastify";
import * as api from "../api";
import {
  FETCH_BLOGS,
  CREATE_BLOG,
  FETCH_BLOG_ID,
  UPDATE_BLOG,
  DELETE_BLOG,
  TOGGLE_LIKE,
} from "../constants/actionTypes";

export const getBlogs = () => async (dispatch) => {
  try {
    const { data } = await api.fetchBlog();
    dispatch({ type: FETCH_BLOGS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createBlog = (blog) => async (dispatch) => {
  try {
    const { data } = await api.createBlog(blog);
    dispatch({ type: CREATE_BLOG, payload: data });
    // toast.success("Blog Created Sucessfully");
  } catch (error) {
    console.log(error);
  }
};

export const getBlogByID = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchBlogByID(id);
    // console.log(data);
    dispatch({ type: FETCH_BLOG_ID, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const updateBlog = (id, updatedblog) => async (dispatch) => {
  try {
    const { data } = await api.updateBlogById(id, updatedblog);
    dispatch({ type: UPDATE_BLOG, payload: data });
    // toast.success("Blog Updated Sucessfully");
  } catch (error) {
    console.log(error);
  }
};

export const deleteBlog = (id) => async (dispatch) => {
  try {
    await api.deleteBlogById(id);
    // console.log(id);
    dispatch({ type: DELETE_BLOG, payload: id });
    // toast.success("Blog Deleted Sucessfully");
  } catch (error) {
    console.log(error);
  }
};

export const toggleLike = (like) => async (dispatch) => {
  try {
    const { data } = await api.createBlog(like);
    dispatch({ type: TOGGLE_LIKE, payload: data });
  } catch (error) {
    console.log(error);
  }
};
