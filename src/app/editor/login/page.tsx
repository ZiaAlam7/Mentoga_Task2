'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditorLogin() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await axios.post('/api/editor_login', {
      name,
      password,
    });

    if (res.status === 200) {
      router.push('/editor');
    }
  } catch (err) {
    setError('Invalid credentials');
    console.log(err)
  }
};

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-20">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required className="border p-2 w-full mb-2" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="border p-2 w-full mb-2" />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 cursor-pointer">Login</button>
    </form>
  );
}
