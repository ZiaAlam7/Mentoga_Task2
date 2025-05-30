import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  color: String,
  slug: String,
  author: String,
  category: String,
});

export const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
