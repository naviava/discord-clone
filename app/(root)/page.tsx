import { UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/theme-toggle";

export default function Home() {
  return (
    <main>
      <UserButton afterSignOutUrl="/" />
      <ThemeToggle />
    </main>
  );
}
