import express from "express";
import { addCategory, getCategory } from "../controller/category.js";
export const categoryRouter = express.Router();
categoryRouter.post("/", addCategory);
categoryRouter.get("/", getCategory);
