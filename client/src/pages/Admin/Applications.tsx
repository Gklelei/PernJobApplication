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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical, Download, FileText, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DeleteJobApplications,
  GetJobApplications,
  UpdateJobApplications,
  updateType,
} from "@/Api/Applications";
import { DEPARTMENTS } from "@/constants";
import { toast } from "sonner";

export interface applicationsType {
  applicationId: string;
  candidate: string;
  position: string;
  department: string;
  status: string;
  appliedDate: Date;
  resumeUrl: string;
  coverLetterUrl: string;
}

export default function Applications() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: applications } = useQuery<applicationsType[]>({
    queryKey: ["GetJobApplications"],
    refetchInterval: 60 * 1000,
    queryFn: GetJobApplications,
  });

  const ApplicationUpdateMutation = useMutation({
    mutationFn: UpdateJobApplications,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["GetJobApplications"] });
      toast.success("Application status updated successfully");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const ApplicationDeleteMutation = useMutation({
    mutationFn: DeleteJobApplications,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["GetJobApplications"] });
      toast.success("Application deleted successfully");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filteredApplications = (applications ?? []).filter((application) => {
    const search = searchQuery.toLowerCase();
    return (
      (selectedStatus === "all" ||
        application.status.toLowerCase() === selectedStatus.toLowerCase()) &&
      (selectedDepartment === "all" ||
        application.department.toLowerCase() ===
          selectedDepartment.toLowerCase()) &&
      (application.candidate.toLowerCase().includes(search) ||
        application.position.toLowerCase().includes(search))
    );
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Applications
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage job applications and candidate pipeline
          </p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-lg bg-gray-800 p-4 shadow-lg mt-6 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search candidates or positions..."
            className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="min-w-[160px] bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600 text-white">
              {[
                { value: "all", label: "All Statuses" },
                { value: "Applied", color: "bg-blue-400" },
                { value: "Screening", color: "bg-purple-400" },
                { value: "Interview", color: "bg-amber-400" },
                { value: "Hired", color: "bg-emerald-400" },
                { value: "Rejected", color: "bg-red-400" },
              ].map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <span className="flex items-center gap-2">
                    {status.value !== "all" && (
                      <span
                        className={`h-2 w-2 rounded-full ${status.color}`}
                      />
                    )}
                    {status.label ?? status.value}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="min-w-[160px] bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600 text-white">
              <SelectItem value="all">All Departments</SelectItem>
              {DEPARTMENTS.map((department) => (
                <SelectItem key={department.value} value={department.value}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-xl border border-gray-700 shadow-lg mt-6">
        <Table>
          <TableHeader className="bg-gray-800">
            <TableRow>
              <TableHead className="w-[25%] text-gray-300">Candidate</TableHead>
              <TableHead className="w-[25%] text-gray-300">Position</TableHead>
              <TableHead className="text-gray-300">Department</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Applied</TableHead>
              <TableHead className="text-gray-300">Documents</TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((application) => (
              <TableRow
                key={application.applicationId}
                className="hover:bg-gray-800/50 border-gray-700"
              >
                <TableCell className="font-medium text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20">
                      <FileText className="h-4 w-4 text-indigo-400" />
                    </div>
                    {application.candidate}
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  {application.position}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="capitalize border-gray-600 text-gray-300"
                  >
                    {application.department}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge
                        variant="outline"
                        className="capitalize cursor-pointer border-gray-600 text-white"
                      >
                        {application.status}
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 text-white border-gray-700">
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {[
                        "Applied",
                        "Screening",
                        "Interview",
                        "Hired",
                        "Rejected",
                      ].map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() =>
                            ApplicationUpdateMutation.mutate({
                              status,
                              id: application.applicationId,
                            } as updateType)
                          }
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-gray-400">
                  {format(new Date(application.appliedDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {application.resumeUrl && (
                      <a
                        href={application.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-indigo-400 hover:text-indigo-600"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                    {application.coverLetterUrl && (
                      <a
                        href={application.coverLetterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-indigo-400 hover:text-indigo-600"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                      {application.resumeUrl && (
                        <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                          <a
                            href={application.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center w-full"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Resume
                          </a>
                        </DropdownMenuItem>
                      )}
                      {application.coverLetterUrl && (
                        <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                          <a
                            href={application.coverLetterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center w-full"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Cover Letter
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="hover:bg-gray-700 cursor-pointer"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            application.applicationId
                          )
                        }
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Copy Application ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-400 hover:bg-red-500/20 cursor-pointer"
                        onClick={() =>
                          ApplicationDeleteMutation.mutate(
                            application.applicationId
                          )
                        }
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete Application
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
