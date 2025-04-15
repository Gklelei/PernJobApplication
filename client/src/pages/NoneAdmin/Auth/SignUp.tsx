import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userRegistration } from "@/Api/Auth";
import { toast } from "sonner";
import LoadingButton from "@/components/LoadingButton";

const SignUp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });
  const mutation = useMutation({
    mutationFn: userRegistration,
    onSuccess: async () => {
      toast.success("Registration successful");
      await queryClient.invalidateQueries({ queryKey: ["ValidateToken"] });
      navigate("/sign-in");
    },
    onError: () => {
      toast.error("Registration failed");
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log({ data });
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-black">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join South Rift Recruitment Portal
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-4">
              <FormField
                name="firstName"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-muted-foreground">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your first name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="lastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-muted-foreground">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your last name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your email"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mutation.isPending ? (
              <LoadingButton />
            ) : (
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 transition-colors"
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?
          <Link to="/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
