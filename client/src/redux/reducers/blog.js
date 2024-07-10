import {
  FETCH_BLOGS,
  CREATE_BLOG,
  FETCH_BLOG_ID,
  UPDATE_BLOG,
  DELETE_BLOG,
  TOGGLE_LIKE,
} from "../constants/actionTypes";
export default (blogs = [], action) => {
  switch (action.type) {
    case FETCH_BLOGS:
      return action.payload;

    case CREATE_BLOG:
      return [...blogs, action.payload];

    case FETCH_BLOG_ID:
      return [action.payload];

    case DELETE_BLOG:
      return blogs.filter((blog) => blog._id !== action.payload._id);

    case TOGGLE_LIKE:
      return [...blogs, action.payload];

    case UPDATE_BLOG:
      blogs.map((blog) =>
        blog._id === action.payload._id ? action.payload : blog
      );
      break;
    default:
      return blogs;
  }
};
