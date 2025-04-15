import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, Search, ChevronDown, Trash2Icon } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import CreateJobPosting from "@/components/Admin/CreateJobPosting";
import {
  DeleteJobPosting,
  GettAllJobPostings,
  jobPostingType,
  UpdateJobPosting,
} from "@/Api/Jobs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Job = {
  id: string;
  title: string;
  location: "remote" | "onsite";
  department: string;
  type: "full-time" | "part-time" | "contract" | "locum";
  salary: string;
  deadline: string;
  status: "open" | "closed" | "paused";
  experience: string;
};

export default function Jobs() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: jobs,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Job[]>({
    queryKey: ["jobPostings"],
    queryFn: GettAllJobPostings,
    retry: 1,
  });

  const filteredJobs =
    jobs?.filter(
      (job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.experience.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const DeleteMutation = useMutation({
    mutationFn: DeleteJobPosting,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["jobPostings"] });
      toast.success("Job posting deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const UpdateMutation = useMutation({
    mutationFn: UpdateJobPosting,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["jobPostings"] });
      toast.success("Job Posting Updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = async (id: string) => {
    DeleteMutation.mutate(id);
  };

  const handleStatusUpdate = async (data: jobPostingType) => {
    UpdateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6 md:px-6 bg-gray-900 min-h-screen text-white">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-48 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 py-6 md:px-6 bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-400 mx-auto w-12 h-12 rounded-full bg-red-900/20 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold">Failed to load jobs</h2>
          <p className="text-gray-400">{error.message}</p>
          <Button
            onClick={() => refetch()}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="px-4 py-6 md:px-6 bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-2xl">📭 </span>
          </div>
          <h2 className="text-xl font-semibold">No jobs found</h2>
          <p className="text-gray-400">Create your first job posting</p>
          <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
            <Plus className="h-4 w-4" />
            Add Job
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-6 bg-gray-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Job Postings</h1>
            <p className="mt-1 text-gray-400">Manage current job openings</p>
          </div>
          <CreateJobPosting />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search jobs..."
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-800 shadow-lg overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow>
                <TableHead className="text-gray-300">Title</TableHead>
                <TableHead className="text-gray-300">Department</TableHead>
                <TableHead className="text-gray-300">Type</TableHead>
                <TableHead className="text-gray-300">Experience</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Deadline</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow
                  key={job.id}
                  className="border-gray-700 hover:bg-gray-800/50 transition-colors"
                >
                  <TableCell className="font-medium text-white">
                    {job.title}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <Badge variant="outline" className="border-gray-600">
                      {job.department}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300 capitalize">
                    {job.type}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {job.experience}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="capitalize px-2 py-1 h-auto text-sm text-white hover:bg-gray-700"
                        >
                          <Badge
                            variant={
                              job.status === "open"
                                ? "default"
                                : job.status === "closed"
                                ? "destructive"
                                : "outline"
                            }
                            className="capitalize"
                          >
                            {job.status}
                          </Badge>
                          <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border border-gray-700 text-white">
                        {["open", "closed", "paused"].map((status) => (
                          <DropdownMenuItem
                            key={status}
                            className="capitalize hover:bg-gray-700"
                            onClick={() =>
                              handleStatusUpdate({
                                id: job.id,
                                status: status,
                              })
                            }
                          >
                            {status}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {format(new Date(job.deadline), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(job.id)}
                    >
                      <Trash2Icon color="red" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredJobs.length === 0 && jobs.length > 0 && (
          <div className="text-center py-6 text-gray-400">
            No jobs found matching your search
          </div>
        )}
      </div>
    </div>
  );
}
