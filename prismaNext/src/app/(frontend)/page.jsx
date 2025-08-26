// src/app/page.tsx
import Action from "@/components/Action";

export default async function Home() {
  // Server-side fetch
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1`);
  const data = await res.json();

  return (
    <div>
      <h1>Welcome to Oxium Developer</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Action />
    </div>
  );
}
