import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTripStore from "../store/tripStore";
import { DESTINATIONS } from "../lib/api";
import { MapPin, Coffee, Bike, Tent, ArrowRight, Sun, Calendar, ShieldCheck } from "lucide-react";

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar({ scrolled }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255, 255, 255, 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(226, 232, 240, 0.8)" : "none",
        padding: scrolled ? "16px 48px" : "24px 48px",
        boxShadow: scrolled ? "0 4px 6px -1px rgba(0, 0, 0, 0.05)" : "none"
      }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer">
          <Sun size={28} className={scrolled ? "text-orange-500" : "text-white"} />
          <span className={`font-display font-bold text-2xl tracking-tight ${scrolled ? "text-slate-900" : "text-white"}`}>
            Weekend<span className="text-orange-500">Wander</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Destinations", "Homestays", "Rentals", "Local Guides"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().split(' ')[0]}`}
              className={`font-body font-medium text-sm transition-colors ${scrolled ? "text-slate-600 hover:text-blue-600" : "text-slate-200 hover:text-white"}`}
            >
              {item}
            </a>
          ))}
        </div>

        <button
          onClick={() => document.getElementById("destinations").scrollIntoView({ behavior: "smooth" })}
          className={`font-body font-semibold text-sm px-6 py-2.5 rounded-full transition-all ${
            scrolled 
            ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg" 
            : "bg-white text-blue-600 hover:bg-blue-50"
          }`}
        >
          Plan My Weekend
        </button>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onExplore }) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 pt-20">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-60"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900/90" />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 animate-on-load stagger-1">
          <Calendar size={14} className="text-orange-400" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">The Weekend-First Platform</span>
        </div>

        <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-6 leading-tight animate-on-load stagger-2">
          Your Weekend Escape, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">Simplified.</span>
        </h1>

        <p className="font-body text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto animate-on-load stagger-3">
          Skip the endless searching. Find local homestays, bike rentals, and authentic food in one place. No signup required. Connect directly with owners.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-on-load stagger-4">
          <button
            onClick={onExplore}
            className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            Explore Destinations <ArrowRight size={18} />
          </button>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <ShieldCheck size={16} className="text-green-400" /> No Login Required
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features (The 4 Pillars) ─────────────────────────────────────────────────
function Features() {
  const features = [
    { icon: <MapPin size={24} />, title: "Local Homestays", desc: "Skip crowded hotels. Stay in verified homes hosted by locals.", color: "bg-blue-100 text-blue-600" },
    { icon: <Bike size={24} />, title: "Bike & Transport", desc: "Rent scooters or bikes directly from local owners at weekend rates.", color: "bg-orange-100 text-orange-600" },
    { icon: <Tent size={24} />, title: "Activities & Guides", desc: "Book treks, rafting, or a local guide who knows the hidden spots.", color: "bg-green-100 text-green-600" },
    { icon: <Coffee size={24} />, title: "Home Kitchens", desc: "Dine like a local. Eat authentic meals prepared in local home kitchens.", color: "bg-rose-100 text-rose-600" },
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 mb-4">Everything you need for the weekend</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">We unlock untapped local supply. From extra rooms to extra scooters, support the local economy directly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow cursor-default group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${f.color} group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Destination Cards with Crowd Indicator ───────────────────────────────────
function DestinationGrid({ onSelect }) {
  const getCrowdStyles = (level) => {
    switch(level) {
      case 'low': return { text: 'Low Crowd', dot: 'crowd-low', bg: 'bg-green-100 text-green-800' };
      case 'medium': return { text: 'Moderate', dot: 'crowd-medium', bg: 'bg-yellow-100 text-yellow-800' };
      case 'high': return { text: 'Crowded', dot: 'crowd-high', bg: 'bg-red-100 text-red-800' };
      default: return { text: 'Unknown', dot: 'crowd-low', bg: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <section id="destinations" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 mb-4">Trending This Weekend</h2>
            <p className="text-slate-600 max-w-xl">
              Our unique Crowd Indicator uses real-time data to tell you how busy a destination will be. Plan smarter.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATIONS.map((dest) => {
            const crowd = getCrowdStyles(dest.crowdLevel);
            return (
              <div
                key={dest.id}
                onClick={() => onSelect(dest)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  
                  {/* Crowd Indicator Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/90 shadow-sm flex items-center text-xs font-semibold ${crowd.bg}`}>
                    <span className={`crowd-dot ${crowd.dot}`}></span>
                    {crowd.text}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-bold text-2xl text-slate-900">{dest.name}</h3>
                    <span className="text-sm font-medium text-slate-500">{dest.state}</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{dest.tagline}</p>
                  
                  <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                    View Weekend Options <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── How it Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: "1", title: "Pick a Destination", desc: "Check our crowd indicator and select where you want to spend your weekend." },
    { num: "2", title: "Build Your Package", desc: "Select a homestay, add a scooter rental, and book a local guide all in one place." },
    { num: "3", title: "Direct Contact", desc: "No complex payment gateways. Send an enquiry and finalize the deal with the owner directly via WhatsApp or Call." }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 mb-6">Frictionless Weekend Planning</h2>
            <p className="text-slate-600 mb-10 text-lg">We've removed all the barriers. No forcing you to create an account. Browse, enquire, and travel.</p>
            
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">
                    {step.num}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 mb-1">{step.title}</h4>
                    <p className="text-slate-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="absolute inset-0 bg-blue-50 rounded-3xl transform rotate-3 scale-105" />
            <img 
              src="https://images.unsplash.com/photo-1522881451255-f59ad836fdfb?q=80&w=2172&auto=format&fit=crop" 
              alt="Friends traveling" 
              className="relative z-10 rounded-3xl shadow-xl w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer CTA ───────────────────────────────────────────────────────────────
function FooterCTA({ onPlan }) {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-orange-500/20" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">
          Ready for the weekend?
        </h2>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Ditch the mainstream hotels. Support local communities and experience the real vibe of your destination.
        </p>
        <button
          onClick={onPlan}
          className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl shadow-xl hover:scale-105 transition-transform text-lg"
        >
          Start Browsing Destinations
        </button>
      </div>
      
      <div className="relative z-10 mt-24 pt-8 border-t border-slate-800 max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
        <div className="font-display font-bold text-xl text-white">
          Weekend<span className="text-orange-500">Wander</span>
        </div>
        <div>© 2026 WeekendWander. The Weekend-First Platform.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">List Your Property</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </section>
  );
}

// ─── Landing Page Orchestrator ────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const setDestination = useTripStore((s) => s.setDestination);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDestinationSelect = (dest) => {
    setDestination(dest);
    navigate("/plan");
  };

  const handlePlan = () => {
    document.getElementById("destinations").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-slate-50 min-h-screen font-body text-slate-900">
      <Navbar scrolled={scrolled} />
      <Hero onExplore={handlePlan} />
      <Features />
      <DestinationGrid onSelect={handleDestinationSelect} />
      <HowItWorks />
      <FooterCTA onPlan={handlePlan} />
    </div>
  );
}

