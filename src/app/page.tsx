"use client";

import Link from "next/link";
import { useState } from "react";
import { useBlogs, Blog } from "@/context/BlogContext";

export default function Home() {
  const { blogs, loading, error } = useBlogs();
  const [category, setCategory] = useState("All");

  if (loading) return <p>Loading blogs...</p>;
  if (error) return <p>Error: {error}</p>;

  const filteredBlogs =
    category === "All"
      ? blogs
      : blogs.filter((blog) => blog.category === category);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="sticky top-0 bg-yellow-300 rounded-sm shadow-md z-50 mb-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between py-5 px-6 sm:px-12">
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-pink-600 select-none">
              LifeVibe
            </h1>
          </div>

          <div className="flex justify-center items-center gap-5">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-48 sm:w-40 rounded-md border border-pink-300 bg-white py-2 px-3 text-pink-700 text-sm font-medium shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 transition"
              aria-label="Select category"
            >
              <option value="All">All Categories</option>
              <option value="Food">Food</option>
              <option value="Wellness">Wellness</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
            <Link className="bg-black p-2 rounded-xl text-sm" href={`/editor`}>Editor</Link>
          </div>
        </div>
      </header>

      <main className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:px-12 px-6">
        {filteredBlogs.map((blog) => (
          <Link key={blog._id} href={`/blog/${blog.slug}`}>
            <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <div
                className="w-full h-48"
                style={{ backgroundColor: blog.color }}
              />
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
                  {blog.title}
                </h2>
                <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                  {blog.content}
                </p>

                <div className="mt-3 flex justify-between text-xs text-gray-500">
                  <span>
                    By: <strong>{blog.author}</strong>
                  </span>
                  <span className="italic">{blog.category}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </main>

      <footer className="text-center mt-12 text-sm text-gray-500">
        © 2025 LifeVibe Magazine. All rights reserved.
      </footer>
    </div>
  );
}
