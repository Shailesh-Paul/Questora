import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sun, Building2, Compass, LogOut, Menu, X } from "lucide-react";
import ListingModal from "./ListingModal";
import useTripStore from "../store/tripStore";

export default function Navbar({ scrolled }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (path, e) => {
    setIsMobileMenuOpen(false);
    if (path.startsWith("/#")) {
      e.preventDefault();
      const id = path.split("#")[1];
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      navigate(path);
    }
  };

  const navItems = [
    { name: "Destinations", path: "/#destinations" },
    { name: "Homestays", path: "/#homestays" },
    { name: "Rentals", path: "/rentals" },
    { name: "Local Guides", path: "/#guides" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    useTripStore.getState().setPaid(false);
    useTripStore.getState().reset();
    navigate("/login");
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
          scrolled || isMobileMenuOpen
            ? "bg-slate-950/80 backdrop-blur-2xl border-b border-white/10 py-3 shadow-2xl"
            : "bg-transparent py-5"
        }`}
      >
        <div className="relative max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer group" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); }}>
            <div
              className={`relative p-2.5 sm:p-3 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500 ${
                scrolled
                  ? "bg-white/10 border border-white/10 backdrop-blur-xl"
                  : "bg-white/15 border border-white/20 backdrop-blur-md"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/40 to-yellow-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Sun
                size={22}
                className="relative text-white group-hover:rotate-180 transition-transform duration-700"
              />
            </div>

            <div className="flex flex-col">
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-white">
                Quest<span className="text-orange-400">ora</span>
              </span>
              <span className="hidden sm:block text-[8px] sm:text-[10px] uppercase tracking-[0.3em] text-white/60">
                Escape Beyond
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={(e) => handleNavClick(item.path, e)}
                className="relative px-4 py-2 rounded-full text-sm font-medium text-white/90 transition-all hover:text-white hover:bg-white/10 group"
              >
                <span className="relative z-10">{item.name}</span>
                <span className="absolute bottom-0 left-1/2 h-[2px] w-0 bg-orange-400 transition-all duration-500 group-hover:w-6 group-hover:left-[calc(50%-12px)]" />
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex items-center gap-2 font-semibold text-sm px-4 py-2.5 rounded-full border border-white/20 text-white backdrop-blur-xl bg-white/10 hover:bg-white/20 transition-all hover:scale-105"
            >
              <Building2 size={16} />
              <span>List Property</span>
            </button>

            {localStorage.getItem("user") && (() => {
              const u = JSON.parse(localStorage.getItem("user"));
              const path = u.role === 'student' ? '/student-dashboard' : u.role === 'employee' ? '/employee-dashboard' : u.role === 'admin' ? '/admin' : '/';
              return (
                <button
                  onClick={() => navigate(path)}
                  className="hidden sm:flex items-center gap-2 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full bg-blue-600/90 text-white shadow-lg transition-all hover:bg-blue-500 hover:scale-105"
                >
                  Dashboard
                </button>
              );
            })()}

            <button
              onClick={() => {
                if (location.pathname === "/") {
                  document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  navigate("/plan");
                }
              }}
              className="group relative overflow-hidden flex items-center gap-2 font-bold text-xs sm:text-sm px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-lg transition-all hover:scale-105"
            >
              <Compass size={16} className="group-hover:rotate-12 transition-transform" />
              <span>Plan Trip</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white/80 hover:text-white bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {localStorage.getItem("user") && (
              <button onClick={handleLogout} className="hidden sm:flex p-2.5 text-red-400 bg-red-500/5 border border-red-500/20 rounded-full hover:bg-red-500/10 transition-all">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-[500px] border-t border-white/10 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 py-8 flex flex-col gap-6 bg-slate-950/90 backdrop-blur-3xl">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={(e) => handleNavClick(item.path, e)}
                className="text-lg font-bold text-white/70 hover:text-orange-400 transition-colors text-left flex items-center justify-between group"
              >
                {item.name}
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </button>
            ))}
            
            <div className="h-[1px] bg-white/10 my-2" />
            
            <button
              onClick={() => { setIsModalOpen(true); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-3 font-bold text-white/80 hover:text-white"
            >
              <Building2 size={20} className="text-orange-400" />
              List Your Property
            </button>

            {localStorage.getItem("user") && (() => {
              const u = JSON.parse(localStorage.getItem("user"));
              const path = u.role === 'student' ? '/student-dashboard' : u.role === 'employee' ? '/employee-dashboard' : u.role === 'admin' ? '/admin' : '/';
              return (
                <button
                  onClick={() => { navigate(path); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 font-bold text-blue-400 hover:text-blue-300 mt-2"
                >
                  <Building2 size={20} />
                  Dashboard
                </button>
              );
            })()}

            {localStorage.getItem("user") && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 font-bold text-red-400 hover:text-red-300 mt-2"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            )}
          </div>
        </div>
      </nav>

      <ListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

// Helper component for arrow icon in mobile menu
function ArrowRight({ size, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}