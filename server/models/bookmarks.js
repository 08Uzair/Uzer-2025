import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "author",
    required: true,
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blogPost",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const category = mongoose.model("category", bookmarkSchema);
