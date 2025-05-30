import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { serialize } from 'cookie';
import  dbConnect from '@/lib/dbConnect';
import { Editor } from '../../../../models/editor_models';

export async function POST(request: Request) {
  const { name, password } = await request.json();
   const inputName = name.toLowerCase();
const inputPass = password.toLowerCase();

  await dbConnect();
  const editor = await Editor.findOne({ name: inputName });

  if (!editor) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

    if (!editor || editor.password !== inputPass) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const authData = JSON.stringify({
  id: editor.id,
  name: editor.name,
});

  const cookie = serialize('editor_auth', authData, {
    path: '/',
    maxAge: 60 * 60 * 1,
  });

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Set-Cookie': cookie,
    },
  });
}
