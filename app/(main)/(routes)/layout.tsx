import NavigationSidebar from "@/components/navigation/navigation-sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-full">
      <nav className="fixed inset-y-0 z-30 hidden h-full w-[72px] flex-col md:flex">
        <NavigationSidebar />
      </nav>
      <main className="h-full md:pl-[72px]">{children}</main>
    </div>
  );
}
