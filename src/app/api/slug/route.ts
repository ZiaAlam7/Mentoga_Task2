// app/api/slug/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; 
import { Blog } from '../../../../models/blog_model';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ message: 'Slug is required' }, { status: 400 });
    }

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
