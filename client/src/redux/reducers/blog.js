import {
  FETCH_BLOGS,
  CREATE_BLOG,
  FETCH_BLOG_ID,
  UPDATE_BLOG,
  DELETE_BLOG,
  TOGGLE_LIKE,
} from "../constants/actionTypes";

const initialState = {
  blog: [],
  singleBlog: [], // or an object if you want to store a single blog post
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BLOGS:
      return {
        ...state,
        blog: action.payload,
      };

    case CREATE_BLOG:
      return {
        ...state,
        blog: [...state.blog, action.payload],
      };

    case FETCH_BLOG_ID:
      return {
        ...state,
        singleBlog: action.payload,
      };

    case DELETE_BLOG:
      return {
        ...state,
        blog: state.blog.filter((blog) => blog._id !== action.payload._id),
      };

    case TOGGLE_LIKE:
    case UPDATE_BLOG:
      // Assuming you want to update the blog array for likes or updates
      return {
        ...state,
        blog: state.blog.map((blog) =>
          blog._id === action.payload._id ? action.payload : blog
        ),
      };

    default:
      return state;
  }
};
