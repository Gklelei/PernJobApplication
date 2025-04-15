import {
  DialogContent,
  DialogTrigger,
  Dialog,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { DEPARTMENTS } from "@/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJobPosting } from "@/Api/Jobs";
import { toast } from "sonner";

import LoadingButton from "../LoadingButton";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(1, "This Field is required"),
  description: z.string().min(1, "This Field is required"),
  requirements: z.string().min(1, "This Field is required"),
  responsibilities: z.string().min(1, "This Field is required"),
  qualifications: z.string().min(1, "This Field is required"),
  skills: z.string().min(1, "This Field is required"),
  location: z.string().min(1, "This Field is required"),
  status: z.string().min(1, "This Field is required"),
  department: z.string().min(1, "This Field is required"),
  type: z.string().min(1, "This Field is required"),
  experience: z.string().min(1, "This Field is required"),
  salary: z.string().min(1),
  deadline: z.date(),
});

const CreateJobPosting = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      responsibilities: "",
      qualifications: "",
      skills: "",
      location: "onsite",
      status: "open",
      department: "",
      type: "full-time",
      experience: "entry",
      salary: "",
      deadline: new Date(),
    },
  });

  const mutation = useMutation({
    mutationFn: createJobPosting,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["jobPostings"] });
      toast.success("Job posting created successfully");
      setOpen(false); // Close the dialog on success
      form.reset(); // Optionally reset the form
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2 w-full sm:w-auto">
          <PlusIcon className="h-4 w-4" />
          Add Job
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border border-gray-700 text-white rounded-xl max-w-lg w-full p-4 shadow-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Create Job Posting</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Department</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((dept) => (
                          <SelectItem
                            key={dept.value}
                            value={dept.value}
                            className="text-sm"
                          >
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Location</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onsite">Onsite</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="locum">Locum</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Experience</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intern">Intern</SelectItem>
                        <SelectItem value="entry">Entry</SelectItem>
                        <SelectItem value="mid">Mid</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Job Title"
                      {...field}
                      className="h-8 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {(
              [
                "description",
                "requirements",
                "responsibilities",
                "qualifications",
                "skills",
              ] as const
            ).map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder={
                          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
                        }
                        {...field}
                        className="h-24 text-sm resize-none"
                        value={field.value as string}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            ))}

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Salary"
                        {...field}
                        className="h-8 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="h-8 justify-start text-left font-normal bg-gray-800 text-white hover:bg-gray-700"
                          >
                            {format(field.value, "PP")}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="bg-gray-800 text-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="h-8 px-4 mx-auto bg-green-600 hover:bg-green-700 text-sm"
            >
              {mutation.isPending ? <LoadingButton /> : "Create Job"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobPosting;
