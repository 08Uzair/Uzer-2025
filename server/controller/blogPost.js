import { blogPost } from "../models/blog.js";
// Add Blog
export const addBlog = async (req, res) => {
  // console.log(req.body);
  const author = req.userId;
  const { title, image, content, category } = req.body;
  const saveData = new blogPost({
    title,
    image,
    content,
    category,
    author,
    createdAt: new Date().toISOString(),
  });
  try {
    await saveData.save();
    res.status(200).json({ message: "Added Sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }
};

// Like Blog
const likeBlog = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No blog with id: ${id}`);
  }

  try {
    const blog = await blogPost.findById(id);

    // Check if the user has already liked this blog post
    const index = blog.likes.findIndex(
      (userId) => userId === String(req.userId)
    );

    if (index === -1) {
      // If the user has not liked the post, add their ID to the likes array
      blog.likes.push(req.userId);
    } else {
      // If the user has already liked the post, remove their ID from the likes array
      blog.likes = blog.likes.filter((userId) => userId !== String(req.userId));
    }

    // Update the blog post with the modified likes array
    const updatedBlog = await blogPost.findByIdAndUpdate(id, blog, {
      new: true,
    });

    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//Get Blog
export const getBlogs = async (req, res) => {
  try {
    const blog = await blogPost
      .find()
      .sort({ createdAt: -1 })
      .populate("author")
      .populate("category");
    res.status(200).json({ blog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed" });
  }
};

// Get Blog by Id
export const getBlogsById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await blogPost
      .findById(id)
      .populate("author")
      .populate("category");
    if (!blog) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Blog
export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const author = req.userId;
  const { title, image, content, category } = req.body;
  try {
    const updatedata = {
      title,
      image,
      content,
      category,
    };
    const updatedBlog = await blogPost.findByIdAndUpdate(id, updatedata, {
      new: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res
      .status(200)
      .json({ updateMember: updateBlog, message: "Added Sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }
};

// Delete Blog
export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBlog = await blogPost.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog Not Found" });
    }
    res.status(200).json({ message: "Blog Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Search Blog
export const searchBlog = async (req, res) => {
  const searchTerm = req.query.q; // Assuming 'q' as the search parameter
  try {
    const results = await blogPost.find({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search for title
        { name: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search for name
        { content: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search for content
      ],
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
