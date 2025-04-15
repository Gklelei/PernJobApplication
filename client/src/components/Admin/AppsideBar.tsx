import {
  BriefcaseIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  UsersIcon,
  LogOutIcon,
  UserIcon,
  MailIcon,
  ShieldIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useNavigate, useLocation, matchPath } from "react-router-dom";
import clsx from "clsx";
import { UseAppContext } from "@/Context/AuthProvider";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Signout } from "@/Api/Auth";
import { toast } from "sonner";

// Utility for class names
const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join("");

// Skeleton component
const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("animate-pulse bg-gray-800 rounded-md", className)}
    {...props}
  />
);

// Sidebar skeleton loader
const SidebarSkeleton = () => (
  <div className="h-screen w-64 bg-gray-900 text-white flex flex-col justify-between p-4 border-r border-gray-800">
    <div className="mb-6">
      <Skeleton className="h-6 w-24 bg-gray-700" />
    </div>
    <div className="space-y-3 flex-1 overflow-y-auto">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
    <div className="space-y-4 border-t border-gray-800 pt-4">
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4 bg-gray-700" />
        <Skeleton className="h-3 w-1/2 bg-gray-700" />
        <Skeleton className="h-3 w-1/3 bg-gray-700" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  </div>
);

// Menu items
const items = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboardIcon },
  { title: "Jobs", href: "/admin/jobs", icon: BriefcaseIcon },
  { title: "Users", href: "/admin/users", icon: UsersIcon },
  { title: "Applications", href: "/admin/applications", icon: FileTextIcon },
];

// Main component
export const AppSidebar = () => {
  const { user } = UseAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      setLoading(false);
    } else {
      const timeout = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [user]);

  const LogoutMutation = useMutation({
    mutationFn: Signout,
    onSuccess: async () => {
      toast.success("Logout successful");
      await queryClient.invalidateQueries({ queryKey: ["ValidateToken"] });
      navigate("/sign-in");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleLogout = () => {
    LogoutMutation.mutate();
  };

  if (loading || !user) return <SidebarSkeleton />;

  return (
    <Sidebar
      className="z-40 border-r border-gray-800 bg-gray-900 text-white"
      collapsible="icon"
    >
      <SidebarContent className="h-screen flex flex-col bg-gray-900 text-white">
        <div className="flex-1 overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupLabel
              className="text-xs font-semibold uppercase tracking-wide px-4 py-3 text-gray-400"
              asChild
            >
              <Link to={"/"}>South Rift</Link>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = !!matchPath(
                    { path: item.href, end: false },
                    location.pathname
                  );
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.href}
                          className={clsx(
                            "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-150",
                            isActive
                              ? "bg-gray-800 text-white"
                              : "text-gray-400"
                          )}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          <span className="text-sm font-medium">
                            {item.title.toUpperCase()}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* User info and logout */}
        <div className="p-4 border-t border-gray-800 space-y-4">
          <div className="bg-gray-800 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium">
                {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <MailIcon className="h-5 w-5 text-gray-400" />
              <span className="text-xs text-gray-300">
                {user.email.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldIcon className="h-5 w-5 text-gray-400" />
              <span className="text-xs text-gray-300">
                {user.role.toUpperCase()}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2 rounded-lg bg-gray-800 hover:bg-red-600 text-white transition-colors"
          >
            <LogOutIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
