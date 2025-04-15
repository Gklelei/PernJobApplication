import { Signout } from "@/Api/Auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UseAppContext } from "@/Context/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MenuIcon,
  UserIcon,
  LogInIcon,
  LogOutIcon,
  ShieldIcon,
  UserPlusIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Header = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isAdmin, isLoggedIn } = UseAppContext();

  const mutation = useMutation({
    mutationFn: Signout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ValidateToken"] });
      toast.success("Logout successful");
      navigate("/sign-in");
    },
    onError: () => toast.error("Logout failed"),
  });

  const handleLogout = () => {
    mutation.mutate();
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-indigo-500 tracking-tight">
              South Rift
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-gray-300 hover:bg-indigo-600 hover:text-white"
                  >
                    <UserIcon className="h-4 w-4" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-300">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserIcon className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>

                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <ShieldIcon className="w-4 h-4 mr-2" />
                      Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOutIcon className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white flex items-center gap-2"
                  >
                    <LogInIcon className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                    <UserPlusIcon className="w-4 h-4" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MenuIcon className="text-gray-300" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-gray-900 border-l border-gray-800 text-gray-300"
              >
                <div className="flex flex-col space-y-4 mt-6">
                  {isLoggedIn ? (
                    <>
                      <Button
                        variant="ghost"
                        className="justify-start flex items-center gap-2"
                        onClick={() => navigate("/profile")}
                      >
                        <UserIcon className="w-4 h-4" />
                        Profile
                      </Button>

                      {isAdmin && (
                        <Button
                          variant="ghost"
                          className="justify-start flex items-center gap-2"
                          onClick={() => navigate("/admin")}
                        >
                          <ShieldIcon className="w-4 h-4" />
                          Admin
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="justify-start flex items-center gap-2"
                        onClick={handleLogout}
                      >
                        <LogOutIcon className="w-4 h-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/sign-in">
                        <Button
                          variant="ghost"
                          className="justify-start w-full flex items-center gap-2"
                        >
                          <LogInIcon className="w-4 h-4" />
                          Login
                        </Button>
                      </Link>
                      <Link to="/sign-up">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full justify-start flex items-center gap-2">
                          <UserPlusIcon className="w-4 h-4" />
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
