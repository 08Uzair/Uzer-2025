import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    // type: String,
    // required: true,
  },
  profileViews: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//author = this is my database for author
export const author = mongoose.model("author", authorSchema);
