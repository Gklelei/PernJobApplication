import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  HeartPulse,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";

export const HeroSection = () => {
  return (
    <div>
      <section className="relative bg-gradient-to-r from-brand-800 to-brand-700 rounded-3xl overflow-hidden shadow-xl">
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.04] bg-[size:20px_20px] pointer-events-none"></div>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 flex flex-col items-center text-center">
          {/* Text Section */}
          <div className="w-full space-y-6 text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Transform Your Healthcare Career
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Join a network of top medical professionals and find positions
              that match your expertise and ambitions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-indigo-600 text-white">
                <Link to="/jobs">Explore Opportunities</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-indigo-600 text-white"
              >
                <Link to="/sign-up" className="text-center">
                  Join Our Network
                </Link>
              </Button>
            </div>

            {/* Featured Stats/Benefits Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition">
                <Stethoscope className="h-8 w-8 text-indigo-300 mx-auto mb-3" />
                <div className="text-2xl font-bold">250+</div>
                <div className="text-sm text-white/80">Medical Specialties</div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition">
                <HeartPulse className="h-8 w-8 text-indigo-300 mx-auto mb-3" />
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-white/80">Placement Success</div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition">
                <CalendarCheck className="h-8 w-8 text-indigo-300 mx-auto mb-3" />
                <div className="text-2xl font-bold">Flexible</div>
                <div className="text-sm text-white/80">Schedules Available</div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition">
                <ShieldCheck className="h-8 w-8 text-indigo-300 mx-auto mb-3" />
                <div className="text-2xl font-bold">Certified</div>
                <div className="text-sm text-white/80">Hospitals Network</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
