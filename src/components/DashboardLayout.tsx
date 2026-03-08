import { AppSidebar } from "./AppSidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <main className="ml-56 min-h-screen p-6 pt-8">
        {children}
      </main>
    </div>
  );
}
