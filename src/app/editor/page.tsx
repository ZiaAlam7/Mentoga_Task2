"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPen } from "react-icons/fa"; 
import Link from "next/link";

const categories = ["Lifestyle", "Food", "Wellness"];

type Blog = {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  color?: string;
  slug?: string;
};

export default function BlogCMS() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [editor, setEditor] = useState<{ id: string; name: string } | null>(null);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null); 

 
  useEffect(() => {
    const cookieName = "editor_auth";
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cookieName}=`);
    if (parts.length === 2) {
      const rawCookie = parts.pop()?.split(";").shift();
      if (rawCookie) {
        try {
          const decoded = decodeURIComponent(rawCookie);
          const parsed = JSON.parse(decoded);
          setEditor(parsed);
        } catch (err) {
          console.error("Failed to decode or parse cookie:", err);
        }
      }
    }
  }, []);

 
  useEffect(() => {
    if (!editor?.name) return;

    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blog");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const allBlogs: Blog[] = await res.json();

        // Filter blogs authored by logged-in editor
        const filtered = allBlogs.filter((b) => b.author === editor?.name);
        setBlogs(filtered);
      } catch (err) {
        console.error(err);
      }
    }

    fetchBlogs();
  }, [editor]);

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) {
      alert("No editor info found");
      return;
    }

    try {
      if (editingId) {
      
        const res = await axios.post("/api/post_blog", {
          id: editingId,
          title,
          content,
          category,
          author: editor.name,
        });
       
        setBlogs((prev) =>
          prev.map((b) =>
            b._id === editingId ? { ...b, title, content, category } : b
          )
        );
        alert("Blog updated successfully!");
      } else {
       
        const res = await axios.post("/api/post_blog", {
          title,
          content,
          category,
          author: editor.name,
        });
       
        setBlogs((prev) => [...prev, res.data.blog]);
        alert("Blog submitted successfully!");
      }

     
      setTitle("");
      setContent("");
      setCategory(categories[0]);
      setEditingId(null);
    } catch (error) {
      console.error(error);
      alert("Error submitting blog.");
    }
  };

 
  const handleEdit = (blog: Blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setCategory(blog.category);
    setEditingId(blog._id);
  };

  
const handleDelete = async (id: string) => {
  if (!confirm("Do you want to delete this blog?")) return;

  try {
    await axios.delete("/api/post_blog", { data: { id } });
    setBlogs((prev) => prev.filter((b) => b._id !== id));
    if (editingId === id) {
      setTitle("");
      setContent("");
      setCategory(categories[0]);
      setEditingId(null);
    }
    alert("Blog deleted successfully!");
  } catch (error) {
    console.error(error);
    alert("Failed to delete blog.");
  }
};


  return (
    <div className="min-h-screen bg-gray-600 flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Welcome {editor?.name}</h1>

     
      <div className="md:w-[50%] w-[85%] mx-auto mt-6 p-8 bg-white rounded-lg shadow-lg">
        <Link href="/" className=" text-blue-600 hover:underline text-sm">
          ← Back to Home
        </Link>
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 mt-2">
          {editingId ? "Edit Blog Post" : "Create New Blog Post"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Blog Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="w-full border border-gray-300 rounded-md p-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
              Content
            </label>
            <textarea
              id="content"
              rows={5}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here..."
              className="w-full border border-gray-300 rounded-md p-3 resize-y text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div>
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 transition duration-300 cursor-pointer"
            >
              {editingId ? "Update Blog" : "Submit Blog"}
            </button>
          </div>
        </form>
      </div>


      <div className="md:w-[70%] w-[90%] mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.length === 0 && (
          <p className="text-white text-center col-span-full">No blogs found.</p>
        )}

        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white shadow-md rounded-lg overflow-hidden relative"
          >
            <div
              className="w-full h-48"
              style={{ backgroundColor: blog.color || "#ddd" }}
            />
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{blog.title}</h2>
              <p className="text-gray-600 mt-2 text-sm line-clamp-2">{blog.content}</p>
              <div className="mt-3 flex justify-between text-xs text-gray-500">
                <span>
                  By: <strong>{blog.author}</strong>
                </span>
                <span className="italic">{blog.category}</span>
              </div>
            </div>

        
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => handleEdit(blog)}
                aria-label="Edit blog"
                className="text-indigo-600 hover:text-indigo-800"
              >
                <FaPen />
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                aria-label="Delete blog"
                className="text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
