import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userRegistration } from "@/Api/Auth";
import { toast } from "sonner";
import { useState } from "react";

const CreateUser = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false); // control dialog open/close state

  const formSchema = z.object({
    firstName: z
      .string({ required_error: "First name is required" })
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string({ required_error: "Last name is required" })
      .min(2, "Last name must be at least 2 characters"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Enter a valid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters long"),
    role: z.enum(["user", "admin"], { required_error: "Role is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  const mutation = useMutation({
    mutationFn: userRegistration,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
      setOpen(false); // close dialog after success
      form.reset(); // optional: reset form after success
    },
    onError: () => {
      toast.error("User creation failed");
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white flex gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border border-gray-700 text-white rounded-xl max-w-md w-full p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter first name"
                      className="bg-gray-800 border border-gray-700 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter last name"
                      className="bg-gray-800 border border-gray-700 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email"
                      type="email"
                      className="bg-gray-800 border border-gray-700 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter password"
                      type="password"
                      className="bg-gray-800 border border-gray-700 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-gray-800 border border-gray-700 text-white">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white border-gray-700">
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary/90"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUser;
