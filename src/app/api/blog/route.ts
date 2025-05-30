// app/api/blogs/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Blog } from "../../../../models/blog_model"; 

export async function GET() {
  try {
    await dbConnect();
    const blogs = await Blog.find();
  
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    return NextResponse.json({ message: "Failed to fetch blogs" }, { status: 500 });
  }
}



