import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useTripStore from "../store/tripStore";
import { DESTINATIONS } from "../lib/api";
import { MapPin, Users, Zap, Shield, Star, ChevronDown, ArrowRight, Compass } from "lucide-react";

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar({ scrolled }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(10,10,11,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(46,46,54,0.5)" : "none",
        padding: scrolled ? "16px 48px" : "28px 48px",
      }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 32, height: 32, border: "1px solid var(--gold)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transform: "rotate(45deg)",
            }}
          >
            <Compass size={14} color="var(--gold)" style={{ transform: "rotate(-45deg)" }} />
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, letterSpacing: 3, color: "var(--cream)" }}>
            LUXE<span style={{ color: "var(--gold)" }}>TREK</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {["Destinations", "Services", "Corporate", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{ color: "var(--cream-dim)", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "var(--gold)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--cream-dim)")}
            >
              {item}
            </a>
          ))}
        </div>

        <button
          onClick={() => document.getElementById("destinations").scrollIntoView({ behavior: "smooth" })}
          style={{
            padding: "10px 28px", border: "1px solid var(--gold)",
            background: "transparent", color: "var(--gold)",
            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
            letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => { e.target.style.background = "var(--gold)"; e.target.style.color = "var(--obsidian)"; }}
          onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "var(--gold)"; }}
        >
          Plan Trip
        </button>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onExplore }) {
  return (
    <section
      style={{
        minHeight: "100vh", position: "relative", display: "flex",
        alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}
    >
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(122,158,126,0.05) 0%, transparent 50%)" }} />

      {/* Decorative lines */}
      <div style={{ position: "absolute", top: "15%", right: "8%", width: 1, height: 120, background: "linear-gradient(to bottom, transparent, var(--gold-dim), transparent)" }} />
      <div style={{ position: "absolute", bottom: "20%", left: "6%", width: 1, height: 80, background: "linear-gradient(to bottom, transparent, var(--gold-dim), transparent)" }} />

      {/* Grid pattern */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(46,46,54,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(46,46,54,0.15) 1px, transparent 1px)", backgroundSize: "80px 80px", opacity: 0.5 }} />

      <div className="text-center max-w-5xl mx-auto px-6" style={{ position: "relative", zIndex: 1 }}>
        <p className="animate-on-load stagger-1" style={{ fontSize: 11, letterSpacing: 6, color: "var(--gold)", textTransform: "uppercase", marginBottom: 32 }}>
          Corporate Weekend Escapes
        </p>

        <h1 className="animate-on-load stagger-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 300, lineHeight: 1.05, color: "var(--cream)", marginBottom: 24 }}>
          Travel is not a <em style={{ color: "var(--gold)", fontStyle: "italic" }}>luxury.</em>
          <br />It is a <em style={{ fontStyle: "italic" }}>necessity.</em>
        </h1>

        <p className="animate-on-load stagger-3" style={{ fontSize: 17, color: "var(--cream-dim)", fontWeight: 300, maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.8 }}>
          One platform for hotels, activities, transfers, and expense splits — crafted exclusively for corporate teams who demand more.
        </p>

        <div className="animate-on-load stagger-4 flex items-center justify-center gap-4">
          <button
            onClick={onExplore}
            style={{
              padding: "16px 48px", background: "var(--gold)",
              border: "none", color: "var(--obsidian)",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13,
              letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
              fontWeight: 500, transition: "all 0.3s ease",
              boxShadow: "0 8px 32px rgba(201,168,76,0.25)",
            }}
            onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 16px 40px rgba(201,168,76,0.35)"; }}
            onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 32px rgba(201,168,76,0.25)"; }}
          >
            Explore Destinations
          </button>
          <button
            style={{
              padding: "16px 48px", background: "transparent",
              border: "1px solid rgba(245,240,232,0.2)", color: "var(--cream-dim)",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13,
              letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = "rgba(245,240,232,0.5)"; e.target.style.color = "var(--cream)"; }}
            onMouseLeave={(e) => { e.target.style.borderColor = "rgba(245,240,232,0.2)"; e.target.style.color = "var(--cream-dim)"; }}
          >
            Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div className="animate-on-load stagger-5 flex items-center justify-center gap-12 mt-20">
          {[["500+", "Destinations"], ["12K+", "Happy Teams"], ["₹0", "Hidden Fees"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, color: "var(--gold)", fontWeight: 300 }}>{num}</div>
              <div style={{ fontSize: 11, color: "var(--cream-dim)", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "float 3s ease-in-out infinite" }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: "var(--cream-dim)", textTransform: "uppercase" }}>Scroll</div>
        <ChevronDown size={14} color="var(--gold)" />
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services() {
  const services = [
    { icon: <MapPin size={20} />, title: "Curated Stays", desc: "Handpicked 4–5 star properties with group rates and dedicated concierge service.", tag: "Hotels" },
    { icon: <Zap size={20} />, title: "Instant Booking", desc: "Book rafting, treks, spa sessions, and private dining in a single flow.", tag: "Activities" },
    { icon: <Users size={20} />, title: "Group Expense Split", desc: "Auto-calculate per-person costs. Generate GST invoices for reimbursement.", tag: "Finance" },
    { icon: <Shield size={20} />, title: "Corporate Billing", desc: "Invoice-ready bookings. Direct billing to company accounts. Zero friction.", tag: "Enterprise" },
    { icon: <Star size={20} />, title: "AI Itinerary", desc: "Gemini-powered itinerary generation. Tell us your vibe, we plan the rest.", tag: "AI" },
    { icon: <Compass size={20} />, title: "Local Insider Access", desc: "Hidden cafes, private experiences, and local guides. Not the tourist trail.", tag: "Exclusive" },
  ];

  return (
    <section id="services" style={{ padding: "120px 48px", background: "var(--carbon)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p style={{ fontSize: 11, letterSpacing: 6, color: "var(--gold)", textTransform: "uppercase", marginBottom: 16 }}>What We Offer</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 300, color: "var(--cream)" }}>
            Everything. <em style={{ color: "var(--gold)" }}>Seamless.</em>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 1, border: "1px solid var(--border)" }}>
          {services.map((s, i) => (
            <div
              key={i}
              style={{
                padding: "48px 40px", background: "var(--carbon)",
                borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
                cursor: "pointer", transition: "all 0.3s ease", position: "relative", overflow: "hidden",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--slate)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--carbon)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ color: "var(--gold)", width: 44, height: 44, border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: 10, letterSpacing: 2, color: "var(--cream-dim)", textTransform: "uppercase", padding: "4px 10px", border: "1px solid var(--border)" }}>
                  {s.tag}
                </span>
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: "var(--cream)", marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: "var(--cream-dim)", lineHeight: 1.7, fontWeight: 300 }}>{s.desc}</p>
              <div style={{ position: "absolute", bottom: 32, right: 32, color: "var(--gold-dim)", opacity: 0, transition: "opacity 0.3s" }} className="arrow-icon">
                <ArrowRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Destination Cards ────────────────────────────────────────────────────────
function DestinationGrid({ onSelect }) {
  return (
    <section id="destinations" style={{ padding: "120px 48px", background: "var(--obsidian)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p style={{ fontSize: 11, letterSpacing: 6, color: "var(--gold)", textTransform: "uppercase", marginBottom: 16 }}>Handpicked</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 300, color: "var(--cream)" }}>
              Weekend <em style={{ color: "var(--gold)" }}>Sanctuaries</em>
            </h2>
          </div>
          <p style={{ fontSize: 14, color: "var(--cream-dim)", maxWidth: 320, lineHeight: 1.7, textAlign: "right" }}>
            Six carefully chosen destinations for corporate teams who want extraordinary, not ordinary.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "380px 380px", gap: 2 }}>
          {DESTINATIONS.map((dest, i) => (
            <div
              key={dest.id}
              className="dest-card"
              onClick={() => onSelect(dest)}
              style={{
                gridColumn: i === 0 ? "span 2" : i === 3 ? "span 2" : "span 1",
                position: "relative", overflow: "hidden", cursor: "pointer",
                background: "var(--slate)",
              }}
            >
              <img
                src={dest.image}
                alt={dest.name}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div
                className="dest-overlay"
                style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, rgba(10,10,11,0.9) 0%, rgba(10,10,11,0.2) 60%, transparent 100%)` }}
              />
              <div style={{ position: "absolute", top: 24, right: 24, padding: "6px 14px", background: "rgba(10,10,11,0.7)", border: `1px solid ${dest.color}40`, backdropFilter: "blur(8px)" }}>
                <span style={{ fontSize: 10, letterSpacing: 2, color: dest.color, textTransform: "uppercase" }}>{dest.tag}</span>
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px" }}>
                <p style={{ fontSize: 11, letterSpacing: 3, color: dest.color, textTransform: "uppercase", marginBottom: 8 }}>{dest.state}</p>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: i === 0 || i === 3 ? 48 : 36, fontWeight: 300, color: "var(--cream)", marginBottom: 8 }}>{dest.name}</h3>
                <p style={{ fontSize: 13, color: "var(--cream-dim)", letterSpacing: 1, marginBottom: 20 }}>{dest.tagline}</p>
                <div
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "10px 24px", border: "1px solid rgba(201,168,76,0.4)",
                    color: "var(--gold)", fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--obsidian)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gold)"; }}
                >
                  Plan This Trip <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Social Proof ─────────────────────────────────────────────────────────────
function Testimonials() {
  const quotes = [
    { text: "Planned a 30-person Coorg retreat in under an hour. Expense splitting alone saved us 3 days of accounting work.", company: "Zepto", role: "VP Operations", initials: "RK" },
    { text: "The Rishikesh itinerary was perfect. Rafting, bonfire, Ganga Aarti — all booked, all confirmed. Zero back and forth.", company: "PhonePe", role: "Head of People", initials: "SA" },
    { text: "Finally an app that understands corporate travel isn't about budget airlines and hostels.", company: "Razorpay", role: "Director, HR", initials: "PM" },
  ];

  return (
    <section style={{ padding: "120px 48px", background: "var(--slate)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p style={{ fontSize: 11, letterSpacing: 6, color: "var(--gold)", textTransform: "uppercase", marginBottom: 16 }}>Trusted By Teams</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 300, color: "var(--cream)" }}>
            What our clients <em style={{ color: "var(--gold)" }}>say</em>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {quotes.map((q, i) => (
            <div key={i} style={{ padding: "40px", background: "var(--carbon)", border: "1px solid var(--border)", position: "relative" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 60, color: "var(--gold-dim)", lineHeight: 0.8, marginBottom: 24, opacity: 0.5 }}>"</div>
              <p style={{ fontSize: 15, color: "var(--cream)", lineHeight: 1.8, fontWeight: 300, marginBottom: 32, fontStyle: "italic" }}>{q.text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, borderTop: "1px solid var(--border)", paddingTop: 24 }}>
                <div style={{ width: 40, height: 40, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--gold)", fontWeight: 500 }}>
                  {q.initials}
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "var(--cream)", fontWeight: 400 }}>{q.role}</div>
                  <div style={{ fontSize: 12, color: "var(--gold)", letterSpacing: 1 }}>{q.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer CTA ───────────────────────────────────────────────────────────────
function FooterCTA({ onPlan }) {
  return (
    <section style={{ padding: "120px 48px", background: "var(--obsidian)", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: 11, letterSpacing: 6, color: "var(--gold)", textTransform: "uppercase", marginBottom: 24 }}>Ready to begin</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 300, color: "var(--cream)", marginBottom: 32, lineHeight: 1.1 }}>
          Your next escape<br /><em style={{ color: "var(--gold)" }}>starts here.</em>
        </h2>
        <button
          onClick={onPlan}
          style={{
            padding: "20px 60px", background: "var(--gold)",
            border: "none", color: "var(--obsidian)",
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            letterSpacing: 3, textTransform: "uppercase", cursor: "pointer",
            fontWeight: 500, transition: "all 0.3s ease",
            boxShadow: "0 8px 40px rgba(201,168,76,0.3)",
          }}
          onMouseEnter={(e) => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 20px 60px rgba(201,168,76,0.4)"; }}
          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 40px rgba(201,168,76,0.3)"; }}
        >
          Plan Your Trip Now
        </button>
      </div>
      <div style={{ marginTop: 80, paddingTop: 40, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--cream-dim)", letterSpacing: 1 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "var(--cream)", letterSpacing: 3 }}>LUXE<span style={{ color: "var(--gold)" }}>TREK</span></span>
        <span>© 2024 LuxeTrek. Corporate Travel Reimagined.</span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map((t) => (
            <a key={t} href="#" style={{ color: "var(--cream-dim)", textDecoration: "none" }}>{t}</a>
          ))}
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
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDestinationSelect = (dest) => {
    setDestination(dest);
    navigate("/plan");
  };

  const handlePlan = () => navigate("/plan");

  return (
    <div style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
      <Navbar scrolled={scrolled} />
      <Hero onExplore={() => document.getElementById("destinations").scrollIntoView({ behavior: "smooth" })} />
      <Services />
      <DestinationGrid onSelect={handleDestinationSelect} />
      <Testimonials />
      <FooterCTA onPlan={handlePlan} />
    </div>
  );
}
