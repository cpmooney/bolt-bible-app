import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
      <h1 className="text-3xl font-bold text-center">Bible Verse Memorization</h1>
      <Link href="/practice">
        <Button>Start Practice</Button>
      </Link>
      <Link href="/admin">
        <Button variant="outline">Admin</Button>
      </Link>
    </div>
  );
}