import { Briefcase, Building2, Loader2, Clock, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Job = {
  id: string;
  title: string;
  location: "remote" | "onsite";
  department: string;
  type: "full-time" | "part-time" | "contract" | "locum";
  salary: string;
  deadline: string;
  urgent?: boolean;
};

type FeaturedJobsProps = {
  jobs: Job[];
  isLoading: boolean;
};

const FeaturedJobs = ({ jobs, isLoading }: FeaturedJobsProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-400 mx-auto" />
          <p className="mt-4 text-gray-300">
            Loading exciting opportunities...
          </p>
        </div>
      </section>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block bg-gray-800/50 rounded-2xl p-8 border border-dashed border-gray-600">
            <p className="text-xl text-gray-400">
              🏥 No current openings - check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center space-y-1">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-blue-400">
            Featured Opportunities
          </h2>
          <p className="text-gray-400 mt-2">
            Discover roles matching your medical expertise
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              variants={cardVariants}
              className={cn(
                "group bg-gray-800 rounded-2xl p-6 border border-white/10",
                "hover:border-brand-400/30 hover:shadow-xl transition-all",
                "flex flex-col justify-between relative overflow-hidden",
                job.urgent && "border-red-500/20 hover:border-red-500/30"
              )}
            >
              {job.urgent && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                    Urgent Hire
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-white pr-4">
                    {job.title}
                  </h3>
                  <span className="shrink-0">
                    {job.location === "remote" ? "🌍" : "🏥"}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-700/50 rounded-lg">
                      <Building2 className="w-5 h-5 text-brand-400" />
                    </div>
                    <span className="text-gray-300 capitalize">
                      {job.department}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-700/50 rounded-lg">
                      <Briefcase className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-gray-300 capitalize">
                      {job.type.replace("-", " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-700/50 rounded-lg">
                      <Banknote className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-gray-300 font-medium">
                      {job.salary}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-700/50 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="text-gray-300">
                      Apply by{" "}
                      <span className="font-medium">
                        {new Date(job.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <Button
                asChild
                className={cn(
                  "w-full mt-6 bg-gradient-to-r from-brand-500 to-blue-500",
                  "hover:from-brand-400 hover:to-blue-400 transition-transform",
                  "hover:scale-[1.02] active:scale-95"
                )}
              >
                <Link to={`/jobs/${job.id}`}>View Position Details</Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
