import {
  MapPin,
  Building2,
  Calendar,
  Briefcase,
  DollarSign,
  BadgeCheck,
  Star,
  ScrollText,
  ListChecks,
  UserCheck,
  Sparkles,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { GetJobById } from "@/Api/Jobs";
import { CreateJobApplication } from "@/Api/Applications";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const JobDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: job,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jobDetails", id],
    queryFn: () => GetJobById(id as string),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: () => CreateJobApplication(id as string),
    onSuccess: () => {
      toast.success("Application submitted successfully 🎉");
      navigate("/profile");
    },
    onError: (error: Error) => {
      toast.error(error.message, {
        icon: <AlertCircle className="w-5 h-5 text-red-400" />,
      });
    },
  });

  const handleJobApplication = async () => {
    mutation.mutate();
  };

  const renderSection = (
    title: string,
    content?: string,
    icon?: React.ReactElement
  ) => {
    if (!content) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 bg-gray-800/50 p-6 rounded-xl border border-gray-700"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400">
            {React.cloneElement(icon, { className: "w-5 h-5" })}
          </div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <ul className="space-y-3 text-gray-300">
          {content.split(",").map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 before:content-['•'] before:text-brand-400 before:font-bold"
            >
              <span className="flex-1">{item.trim()}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    );
  };

  if (isLoading) return <JobDetailsSkeleton />;

  if (error || !job)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-8 bg-gray-800/50 rounded-2xl border border-red-500/20">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-semibold text-white">Job Not Found</h2>
          <p className="text-gray-400">
            The job you're looking for doesn't exist or may have been removed
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="mt-4 bg-gray-700 hover:bg-gray-600"
          >
            Return to Jobs
          </Button>
        </div>
      </div>
    );

  return (
    <div className="bg-gray-900 text-white min-h-screen pb-32">
      <div className="max-w-5xl mx-auto px-4 lg:px-0 py-12 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gray-800 to-gray-800/50 p-8 rounded-2xl border border-gray-700 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-300 to-blue-400 bg-clip-text text-transparent">
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 bg-gray-700/30 px-3 py-1 rounded-full">
                  <Building2 className="h-4 w-4 text-brand-400" />
                  <span className="capitalize">{job.department}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-700/30 px-3 py-1 rounded-full">
                  <MapPin className="h-4 w-4 text-purple-400" />
                  <span className="capitalize">{job.location}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-700/30 px-3 py-1 rounded-full">
                  <Briefcase className="h-4 w-4 text-green-400" />
                  <span className="capitalize">{job.type}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 min-w-[200px]">
              <div className="flex items-center gap-2 bg-gray-700/30 p-3 rounded-xl">
                <DollarSign className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Salary</p>
                  <p className="font-semibold">{job.salary}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-700/30 p-3 rounded-xl">
                <Clock className="h-5 w-5 text-red-400" />
                <div>
                  <p className="text-xs text-gray-400">Apply Before</p>
                  <p className="font-semibold">
                    {format(new Date(job.deadline), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Star className="w-4 h-4" />
              {job.experience} Level
            </span>
            <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
              {job.status}
            </span>
          </div>
        </motion.div>

        {/* Job Content */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 bg-gray-800/50 p-8 rounded-2xl border border-gray-700"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400">
                  <ScrollText className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Description
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>
          </motion.div>

          {renderSection(
            "Responsibilities",
            job.responsibilities,
            <ListChecks />
          )}
          {renderSection("Requirements", job.requirements, <BadgeCheck />)}
          {renderSection("Qualifications", job.qualifications, <UserCheck />)}
          {renderSection("Preferred Skills", job.skills, <Sparkles />)}
        </div>
      </div>

      {/* Sticky Apply Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950/90 border-t border-gray-800 backdrop-blur-lg z-50">
        <div className="max-w-5xl mx-auto px-4 lg:px-0 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2 text-amber-300">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">
                Closing on {format(new Date(job.deadline), "MMM do")}
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              {job.applications} applications received
            </p>
          </div>

          <Button
            size="lg"
            onClick={handleJobApplication}
            className={cn(
              "w-full md:w-auto bg-gradient-to-r from-brand-500 to-blue-500",
              "hover:from-brand-400 hover:to-blue-400 transition-transform",
              "hover:scale-[1.02] active:scale-95 shadow-lg",
              mutation.isPending && "opacity-90 cursor-not-allowed"
            )}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </div>
            ) : (
              "Apply Now"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const JobDetailsSkeleton = () => (
  <div className="bg-gray-900 min-h-screen pb-32">
    <div className="max-w-5xl mx-auto px-4 lg:px-0 py-12 space-y-8">
      <Skeleton className="h-40 w-full rounded-2xl bg-gray-800" />
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-xl bg-gray-800" />
      ))}
    </div>
  </div>
);

export default JobDetailsPage;
