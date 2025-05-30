import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { Blog } from "../../../../models/blog_model";


export async function POST(request: Request) {
  try {
    await dbConnect();
    const { title, content, category, author, id } = await request.json();

    if (!title || !content || !category || !author) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    function generateSlug(title: string, author: string): string {
      const slugBase = `${title}-${author}`;
      return slugBase
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const slug = generateSlug(title, author);

    function getRandomHexColor(): string {
      const hex = Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0");
      return `#${hex}`;
    }

    const color: string = getRandomHexColor();

    if (!id) {
      const newBlog = await Blog.create({
        title,
        content,
        category,
        author,
        color,
        slug,
      });

      return NextResponse.json(
        {
          message: "Blog saved successfully!",
          blog: newBlog,
        },
        { status: 201 }
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, category, slug },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json(
        { error: "Blog not found or failed to update" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Blog updated successfully!",
        blog: updatedBlog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving blog:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing blog id" }, { status: 400 });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
