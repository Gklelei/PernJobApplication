import FeaturedJobs from "@/components/None-Admin/FeaturedJobs";
import { HeroSection } from "../HeroSection";
import { useQuery } from "@tanstack/react-query";
import { GettAllJobPostings } from "@/Api/Jobs";

const HomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["jobPosting"],
    refetchInterval: 60 * 1000,
    queryFn: GettAllJobPostings,
  });
  return (
    <div className="bg-gray-900">
      <HeroSection />
      <FeaturedJobs jobs={data} isLoading={isLoading} />
    </div>
  );
};

export default HomePage;
