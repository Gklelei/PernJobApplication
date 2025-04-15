import Footer from "@/components/None-Admin/Footer";
import Header from "@/pages/NoneAdmin/Header";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Sticky Header */}
      <header className="shadow bg-white sticky top-0 z-50">
        <Header />
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
