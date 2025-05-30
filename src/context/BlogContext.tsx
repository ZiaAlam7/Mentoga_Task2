"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Blog = {
  _id: string;
  title: string;
  content: string;
  color: string;
  slug: string;
  author: string;
  category: string;
};

type BlogContextType = {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
};

const BlogContext = createContext<BlogContextType>({
  blogs: [],
  loading: false,
  error: null,
});

export function BlogProvider({ children }: { children: ReactNode }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/blog");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data: Blog[] = await res.json();
        setBlogs(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  return (
    <BlogContext.Provider value={{ blogs, loading, error }}>
      {children}
    </BlogContext.Provider>
  );
}


export function useBlogs() {
  return useContext(BlogContext);
}
