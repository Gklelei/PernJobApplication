import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Loader2 } from "lucide-react";
import { DEPARTMENTS } from "@/constants";
import { UseAppContext } from "@/Context/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Signout } from "@/Api/Auth";
import { toast } from "sonner";

const Footer = () => {
  const queryClient = useQueryClient();
  const { isLoggedIn } = UseAppContext();
  const mutation = useMutation({
    mutationFn: Signout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ValidateToken"] });
      toast.success("LogOut Success");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Logo & Mission */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">
            South Rift Medical Center
          </h2>
          <p className="text-sm leading-relaxed">
            Connecting healthcare professionals with rewarding careers. Your
            journey to impact lives begins here.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/jobs" className="hover:underline">
                Browse Jobs
              </Link>
            </li>
            <li>
              <Link to="/sign-up" className="hover:underline">
                Create Account
              </Link>
            </li>
            {isLoggedIn ? (
              <li>
                <Link
                  to="#"
                  className="hover:underline"
                  onClick={() => mutation.mutate()}
                >
                  {mutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "LogOut"
                  )}
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/sign-in" className="hover:underline">
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Departments */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Departments</h3>
          <ul className="space-y-2 text-sm">
            {DEPARTMENTS.slice(1, 6).map((val) => (
              <li key={val.value}>{val.name}</li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Get in Touch
          </h3>
          <ul className="space-y-2 text-sm">
            <li>Email: careers@southrift.com</li>
            <li>Phone: +254712345678</li>
            <li>Address: 123 Health St, MedCity, Kericho</li>
          </ul>
          <div className="flex gap-4 mt-4">
            <a href="#" aria-label="Facebook" className="hover:text-white">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 mt-12 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SouthRift Medical Center. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
