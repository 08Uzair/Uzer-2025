import express from "express";
import { getAuthor, getAuthorById, signin, signup } from "../controller/auth.js";
export const userRouter = express.Router();
userRouter.get("/", getAuthor);
userRouter.get("/:id", getAuthorById);
userRouter.post("/signIn", signin);
userRouter.post("/signUp", signup);
