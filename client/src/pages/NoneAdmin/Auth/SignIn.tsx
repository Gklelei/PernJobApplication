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
import { userSignIn } from "../../../Api/Auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import LoadingButton from "@/components/LoadingButton";
import { useQueryClient } from "@tanstack/react-query";

const SignIn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const formSchema = z.object({
    password: z
      .string({ required_error: "This field is required" })
      .min(8, "Password must be at least 8 characters long"),
    email: z
      .string({ required_error: "This field is required" })
      .email("Enter a valid email address"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });
  const mutation = useMutation({
    mutationFn: userSignIn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["ValidateToken"],
        refetchType: "active",
      });
      await queryClient.invalidateQueries({
        queryKey: ["GetUserRole"],
        refetchType: "active",
      });
      await queryClient.invalidateQueries({
        queryKey: ["user"],
        refetchType: "active",
      });
      toast.success("Login successful");
      navigate("/");
    },
    onError: () => {
      toast.error("Login failed");
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log({ data });
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-black">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to South Rift Recruitment Portal
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-primary hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
