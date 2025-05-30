export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const path_name = process.env.NEXT_PUBLIC_BASE_URL || 'https://mentoga-task2.vercel.app';

async function getBlog(slug) {
  try {
    const response = await axios.post(`${path_name}/api/slug`, { slug });

    if (response.status !== 200) return null;

    return response.data;
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return null;
  }
}

export default async function BlogPage({ params }) {
  const blog = await getBlog(params.slug);

  if (!blog) return notFound();

  return (
    <div className="min-h-screen bg-gray-600 flex items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8 relative">
        <Link href="/" className="absolute top-4 left-4 text-blue-600 hover:underline text-sm">
          ← Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-900 mt-6">{blog.title}</h1>
        <p className="text-sm text-gray-500 mb-6">By <span className="font-medium text-gray-700">{blog.author}</span></p>
        <hr className="mb-6" />
        <p className="text-lg text-gray-800 leading-relaxed">{blog.content}</p>
      </div>
    </div>
  );
}
