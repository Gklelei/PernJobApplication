import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Loader2, Search, Trash2Icon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeleteUser, GetAllUsers, UPdateCurrentUser } from "@/Api/user";
import CreateUser from "@/components/Admin/CreateUser";
import { toast } from "sonner";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "admin";
  gender?: "male" | "female" | null;
  imageUrl?: string | null;
  cvUrl?: string | null;
  coverLetterUrl?: string | null;
  plan?: "free" | "premium" | null;
  applications?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function Users() {
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: GetAllUsers,
    refetchInterval: 60 * 1000,
    retry: 1,
  });

  const filteredUsers =
    users?.filter((user) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower) ||
        (user.plan?.toLowerCase() || "").includes(searchLower)
      );
    }) || [];

  const UpdateMutation = useMutation({
    mutationFn: UPdateCurrentUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User Role Updated");
      setUpdatingUserId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setUpdatingUserId(null);
    },
  });

  const DeleteMutation = useMutation({
    mutationFn: DeleteUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User Deleted");
    },
    onError: (e: Error) => {
      toast.error(e.message);
    },
  });

  const HandleDelete = async (id: string) => {
    DeleteMutation.mutate({ id });
  };

  if (!users) return <p className="text-white">No users Found</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              User Management
            </h1>
            <p className="text-sm text-gray-400">
              Manage your users and their permissions
            </p>
          </div>
          <CreateUser />
        </div>

        {/* Search Bar */}
        <div className="mb-6 rounded-xl bg-gray-800 p-4 shadow-md">
          <div className="relative">
            <Search className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              className="pl-10 bg-gray-900 border border-gray-700 text-white placeholder:text-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* User Table */}
        <div className="rounded-xl border border-gray-700 shadow-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-800 text-gray-300">
              <TableRow>
                <TableHead className="w-[25%]">User</TableHead>
                <TableHead className="w-[30%]">Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-gray-800/70 transition"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {user.imageUrl && (
                        <img
                          src={user.imageUrl}
                          alt="User avatar"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      )}
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400">{user.email}</TableCell>

                  {/* Role Dropdown */}
                  <TableCell>
                    {UpdateMutation.isPending && updatingUserId === user.id ? (
                      <Loader2 className="animate-spin h-5 w-5 text-gray-400 mx-auto" />
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="px-2 py-1 h-auto text-sm text-white hover:bg-gray-700 capitalize"
                          >
                            <Badge
                              variant={
                                user.role === "admin" ? "default" : "outline"
                              }
                            >
                              {user.role}
                            </Badge>
                            <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800 border border-gray-700 text-white">
                          {["user", "admin"].map((role) => (
                            <DropdownMenuItem
                              key={role}
                              onClick={() => {
                                setUpdatingUserId(user.id);
                                UpdateMutation.mutate({
                                  id: user.id,
                                  role: role as "admin" | "user",
                                });
                              }}
                              className="capitalize hover:bg-gray-700"
                            >
                              {role}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={user.plan === "premium" ? "default" : "outline"}
                      className="capitalize"
                    >
                      {user.plan || "free"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(user.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </TableCell>

                  {/* Actions Dropdown */}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => HandleDelete(user.id)}
                    >
                      <Trash2Icon color="red" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && users.length > 0 && (
          <div className="text-center py-6 text-gray-400">
            No users found matching your search
          </div>
        )}
      </div>
    </div>
  );
}
