import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GettAllJobPostings } from "@/Api/Jobs";
import { DEPARTMENTS } from "@/constants";

interface Job {
  id: string;
  title: string;
  company: string;
  department: string;
  type: string;
  location: string;
  postedDate: string;
  description: string;
}

export default function AllJobsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const { data } = useQuery<Job[]>({
    queryKey: ["jobPosting"],
    queryFn: GettAllJobPostings,
  });

  if (!data) {
    return <p>No Jobs Found</p>;
  }

  const filteredJobs = data.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" || job.department === selectedDepartment;
    const matchesType = selectedType === "all" || job.type === selectedType;
    return matchesSearch && matchesDepartment && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Explore Job Openings</h1>
          <p className="text-gray-400 mt-1">
            Find jobs that match your skills and interests
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search job title or company..."
              className="pl-10 bg-gray-800 border-gray-600 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white min-w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {DEPARTMENTS.map((dept, i) => (
                <SelectItem value={dept.value} key={i}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white min-w-[150px]">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <Link key={job.id} to={`/jobs/${job.id}`}>
              <Card className="bg-gray-800 border-gray-700 hover:border-indigo-500 transition cursor-pointer">
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                    <Badge
                      variant="outline"
                      className="text-sm border-gray-600"
                    >
                      {job.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">{job.company}</p>
                  <p className="text-sm text-gray-400">{job.location}</p>
                  <p className="text-sm text-gray-300 line-clamp-3">
                    {job.description}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>{job.department}</span>
                    <span>{job.postedDate}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
