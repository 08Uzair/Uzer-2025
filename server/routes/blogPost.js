import express from "express";

import {
  addBlog,
  deleteBlog,
  getBlogs,
  getBlogsById,
  updateBlog,
} from "../controller/blogPost.js";
import { auth } from "../middleware/auth.js";
export const blogRouter = express.Router();
blogRouter.post("/", auth, addBlog);
blogRouter.get("/", getBlogs);
blogRouter.get("/:id", getBlogsById);
blogRouter.delete("/:id", deleteBlog);
blogRouter.put("/:id", updateBlog);
 