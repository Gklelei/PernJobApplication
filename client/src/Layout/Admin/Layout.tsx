import { AppSidebar } from "@/components/Admin/AppsideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-900 w-full">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
