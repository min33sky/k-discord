import { ThemeToggle } from '@/components/theme-toggle';
import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <main className="">
      <UserButton afterSignOutUrl="/" />
      <ThemeToggle />
    </main>
  );
}
