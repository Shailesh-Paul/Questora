import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTripStore from "../store/tripStore";
import { fetchWeather, DESTINATIONS } from "../lib/api";
import { ArrowLeft, ArrowRight, Users, Calendar, Wallet, Zap, Check, Compass, ChevronDown } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const ACTIVITIES = [
  { id: "rafting", label: "White Water Rafting", icon: "🌊", category: "Adventure" },
  { id: "trekking", label: "Himalayan Trek", icon: "⛰️", category: "Adventure" },
  { id: "bungee", label: "Bungee Jumping", icon: "🪂", category: "Extreme" },
  { id: "camping", label: "Riverside Camping", icon: "🏕️", category: "Outdoor" },
  { id: "yoga", label: "Yoga & Meditation", icon: "🧘", category: "Wellness" },
  { id: "spa", label: "Luxury Spa", icon: "💆", category: "Wellness" },
  { id: "kayaking", label: "Kayaking", icon: "🛶", category: "Water" },
  { id: "aarti", label: "Ganga Aarti", icon: "🪔", category: "Culture" },
  { id: "cafe", label: "Local Cafe Hopping", icon: "☕", category: "Food" },
  { id: "bonfire", label: "Bonfire Night", icon: "🔥", category: "Outdoor" },
  { id: "zipline", label: "Zipline & Rappelling", icon: "🧗", category: "Extreme" },
  { id: "jeep", label: "Jeep Safari", icon: "🚙", category: "Adventure" },
];

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepDots({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 24 : 8, height: 8,
            background: i === current ? "var(--gold)" : i < current ? "var(--gold-dim)" : "var(--border)",
            borderRadius: 4, transition: "all 0.4s ease",
          }}
        />
      ))}
    </div>
  );
}

// ─── Destination Selector ────────────────────────────────────────────────────
function DestinationStep({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="animate-on-load">
      <label style={{ fontSize: 11, letterSpacing: 3, color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: 16 }}>
        Select Destination
      </label>

      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "20px 24px", border: "1px solid var(--border)", background: "var(--slate)",
          cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
          transition: "border-color 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
      >
        {value ? (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 40, height: 40, background: "var(--muted)", overflow: "hidden" }}>
              <img src={value.image} alt={value.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "var(--cream)" }}>{value.name}</div>
              <div style={{ fontSize: 12, color: "var(--cream-dim)", letterSpacing: 1 }}>{value.state}</div>
            </div>
          </div>
        ) : (
          <span style={{ color: "var(--cream-dim)", fontSize: 15 }}>Choose your destination...</span>
        )}
        <ChevronDown size={16} color="var(--gold)" style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }} />
      </div>

      {open && (
        <div style={{ border: "1px solid var(--border)", borderTop: "none", background: "var(--carbon)", zIndex: 10 }}>
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              onClick={() => { onChange(dest); setOpen(false); }}
              style={{
                padding: "16px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16,
                borderBottom: "1px solid var(--border)", transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--slate)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ width: 48, height: 36, overflow: "hidden", flexShrink: 0 }}>
                <img src={dest.image} alt={dest.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "var(--cream)" }}>{dest.name}</div>
                <div style={{ fontSize: 12, color: "var(--cream-dim)" }}>{dest.tagline} · {dest.state}</div>
              </div>
              <span style={{ fontSize: 10, letterSpacing: 2, color: dest.color, textTransform: "uppercase", padding: "3px 10px", border: `1px solid ${dest.color}40` }}>{dest.tag}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Member Count ─────────────────────────────────────────────────────────────
function MembersStep({ value, onChange }) {
  const presets = [5, 10, 15, 20, 25, 30];
  return (
    <div className="animate-on-load">
      <label style={{ fontSize: 11, letterSpacing: 3, color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: 24 }}>
        Number of Members
      </label>

      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }} className="number-stepper">
        <button onClick={() => onChange(Math.max(2, value - 1))}>−</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 72, color: "var(--cream)", lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 12, color: "var(--cream-dim)", letterSpacing: 2, textTransform: "uppercase" }}>Travelers</div>
        </div>
        <button onClick={() => onChange(Math.min(100, value + 1))}>+</button>
      </div>

      <div>
        <p style={{ fontSize: 12, color: "var(--cream-dim)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Quick select</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {presets.map((n) => (
            <button
              key={n}
              onClick={() => onChange(n)}
              style={{
                padding: "8px 20px", border: `1px solid ${value === n ? "var(--gold)" : "var(--border)"}`,
                background: value === n ? "rgba(201,168,76,0.1)" : "transparent",
                color: value === n ? "var(--gold)" : "var(--cream-dim)",
                fontSize: 14, cursor: "pointer", transition: "all 0.2s",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Budget Slider ────────────────────────────────────────────────────────────
function BudgetStep({ value, type, onValueChange, onTypeChange }) {
  const min = 3000, max = 100000;
  const pct = ((value - min) / (max - min)) * 100;

  const tiers = [
    { label: "Economy", range: "₹3K–8K", min: 3000, color: "#7A9E7E" },
    { label: "Premium", range: "₹8K–25K", min: 8000, color: "var(--gold)" },
    { label: "Luxury", range: "₹25K+", min: 25000, color: "#C97B5A" },
  ];

  const currentTier = value >= 25000 ? tiers[2] : value >= 8000 ? tiers[1] : tiers[0];

  return (
    <div className="animate-on-load">
      <label style={{ fontSize: 11, letterSpacing: 3, color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: 24 }}>
        Budget Range
      </label>

      {/* Toggle */}
      <div style={{ display: "flex", border: "1px solid var(--border)", marginBottom: 32, width: "fit-content" }}>
        {["per_person", "total"].map((t) => (
          <button
            key={t}
            onClick={() => onTypeChange(t)}
            style={{
              padding: "10px 24px", border: "none", cursor: "pointer",
              background: type === t ? "var(--gold)" : "transparent",
              color: type === t ? "var(--obsidian)" : "var(--cream-dim)",
              fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
            }}
          >
            {t === "per_person" ? "Per Person" : "Total Budget"}
          </button>
        ))}
      </div>

      {/* Amount display */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 60, color: "var(--cream)", lineHeight: 1 }}>
            ₹{value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
          </span>
          <span style={{ fontSize: 12, color: "var(--cream-dim)", letterSpacing: 2, textTransform: "uppercase" }}>{type === "per_person" ? "/ person" : "total"}</span>
        </div>
        <span style={{ fontSize: 12, letterSpacing: 2, color: currentTier.color, textTransform: "uppercase", padding: "4px 12px", border: `1px solid ${currentTier.color}40` }}>
          {currentTier.label} Tier
        </span>
      </div>

      {/* Slider */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <div style={{ height: 2, background: "var(--border)", borderRadius: 2, position: "relative", marginBottom: 8 }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: "var(--gold)", borderRadius: 2, transition: "width 0.1s" }} />
        </div>
        <input
          type="range" min={min} max={max} step={1000} value={value}
          onChange={(e) => onValueChange(Number(e.target.value))}
          style={{ width: "100%", position: "absolute", top: -8, left: 0, opacity: 0, height: 20, cursor: "pointer" }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        {tiers.map((t) => (
          <button
            key={t.label}
            onClick={() => onValueChange(t.min)}
            style={{
              padding: "8px 16px", border: `1px solid ${currentTier.label === t.label ? t.color : "var(--border)"}`,
              background: currentTier.label === t.label ? `${t.color}15` : "transparent",
              color: currentTier.label === t.label ? t.color : "var(--cream-dim)",
              fontSize: 12, cursor: "pointer", transition: "all 0.2s",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {t.label} <span style={{ opacity: 0.6 }}>{t.range}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Date Picker ──────────────────────────────────────────────────────────────
function DateStep({ value, onChange }) {
  const nextFriday = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = (5 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const quickWeekends = [0, 1, 2, 3].map((w) => {
    const fri = nextFriday();
    fri.setDate(fri.getDate() + w * 7);
    const sun = new Date(fri);
    sun.setDate(sun.getDate() + 2);
    return { start: fri, end: sun, label: w === 0 ? "This Weekend" : w === 1 ? "Next Weekend" : `+${w}w` };
  });

  return (
    <div className="animate-on-load">
      <label style={{ fontSize: 11, letterSpacing: 3, color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: 24 }}>
        Travel Dates
      </label>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {quickWeekends.map((w) => (
          <button
            key={w.label}
            onClick={() => onChange({ start: w.start, end: w.end })}
            style={{
              padding: "10px 20px", border: "1px solid var(--border)", background: "transparent",
              color: "var(--cream-dim)", fontSize: 12, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", letterSpacing: 1,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; e.currentTarget.style.color = "var(--gold)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--cream-dim)"; }}
          >
            {w.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, color: "var(--cream-dim)", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>Check In</p>
          <DatePicker
            selected={value.start}
            onChange={(date) => onChange({ ...value, start: date })}
            minDate={new Date()}
            placeholderText="Select date"
            className="premium-input"
            style={{ width: "100%", padding: "14px 20px", fontSize: 15 }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, color: "var(--cream-dim)", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>Check Out</p>
          <DatePicker
            selected={value.end}
            onChange={(date) => onChange({ ...value, end: date })}
            minDate={value.start || new Date()}
            placeholderText="Select date"
            className="premium-input"
            style={{ width: "100%", padding: "14px 20px", fontSize: 15 }}
          />
        </div>
      </div>

      {value.start && value.end && (
        <div style={{ marginTop: 20, padding: "16px 20px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)" }}>
          <span style={{ fontSize: 13, color: "var(--gold)" }}>
            {Math.round((value.end - value.start) / (1000 * 60 * 60 * 24))} nights ·{" "}
            {value.start.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} →{" "}
            {value.end.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Activity Picker ──────────────────────────────────────────────────────────
function ActivitiesStep({ value, onToggle }) {
  const categories = [...new Set(ACTIVITIES.map((a) => a.category))];
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? ACTIVITIES : ACTIVITIES.filter((a) => a.category === active);

  return (
    <div className="animate-on-load">
      <label style={{ fontSize: 11, letterSpacing: 3, color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
        Must-Do Activities
      </label>
      <p style={{ fontSize: 13, color: "var(--cream-dim)", marginBottom: 24 }}>Select all you want — we'll build your itinerary around them.</p>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            style={{
              padding: "6px 16px", border: `1px solid ${active === cat ? "var(--gold)" : "var(--border)"}`,
              background: active === cat ? "rgba(201,168,76,0.1)" : "transparent",
              color: active === cat ? "var(--gold)" : "var(--cream-dim)",
              fontSize: 11, cursor: "pointer", letterSpacing: 2, textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
        {filtered.map((activity) => {
          const selected = value.includes(activity.id);
          return (
            <div
              key={activity.id}
              onClick={() => onToggle(activity.id)}
              style={{
                padding: "16px 18px", border: `1px solid ${selected ? "var(--gold)" : "var(--border)"}`,
                background: selected ? "rgba(201,168,76,0.08)" : "var(--slate)",
                cursor: "pointer", transition: "all 0.25s", position: "relative",
                display: "flex", alignItems: "center", gap: 12,
              }}
              onMouseEnter={(e) => { if (!selected) e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; }}
              onMouseLeave={(e) => { if (!selected) e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <span style={{ fontSize: 22 }}>{activity.icon}</span>
              <div>
                <div style={{ fontSize: 13, color: selected ? "var(--gold)" : "var(--cream)", fontWeight: 400, lineHeight: 1.3 }}>{activity.label}</div>
                <div style={{ fontSize: 11, color: "var(--cream-dim)", letterSpacing: 1 }}>{activity.category}</div>
              </div>
              {selected && (
                <div style={{ position: "absolute", top: 8, right: 8, width: 16, height: 16, background: "var(--gold)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={10} color="var(--obsidian)" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {value.length > 0 && (
        <div style={{ marginTop: 16, padding: "12px 20px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "var(--gold)" }}>{value.length} activities selected</span>
          <button onClick={() => value.forEach(onToggle)} style={{ fontSize: 12, color: "var(--cream-dim)", background: "none", border: "none", cursor: "pointer" }}>Clear all</button>
        </div>
      )}
    </div>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryPanel({ destination, members, budget, budgetType, dateRange, activities, onConfirm, loading }) {
  const nights = dateRange.start && dateRange.end
    ? Math.round((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24)) : 0;
  const totalBudget = budgetType === "per_person" ? budget * members : budget;

  return (
    <div style={{
      background: "var(--carbon)", border: "1px solid var(--border)",
      padding: "40px 32px", position: "sticky", top: 100, height: "fit-content",
    }}>
      <p style={{ fontSize: 11, letterSpacing: 3, color: "var(--gold)", textTransform: "uppercase", marginBottom: 32 }}>Trip Summary</p>

      {destination && (
        <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: "100%", height: 120, overflow: "hidden", marginBottom: 12 }}>
            <img src={destination.image} alt={destination.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "var(--cream)" }}>{destination.name}</div>
          <div style={{ fontSize: 12, color: "var(--cream-dim)" }}>{destination.state}</div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {[
          { icon: <Users size={14} />, label: "Members", value: members ? `${members} travelers` : "—" },
          { icon: <Wallet size={14} />, label: "Total Budget", value: totalBudget ? `₹${totalBudget.toLocaleString("en-IN")}` : "—" },
          { icon: <Calendar size={14} />, label: "Duration", value: nights ? `${nights} nights` : "—" },
          { icon: <Zap size={14} />, label: "Activities", value: activities.length ? `${activities.length} selected` : "—" },
        ].map((row) => (
          <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--cream-dim)", fontSize: 13 }}>
              {row.icon} {row.label}
            </div>
            <span style={{ fontSize: 14, color: "var(--cream)", fontWeight: 400 }}>{row.value}</span>
          </div>
        ))}
      </div>

      {members && budget && (
        <div style={{ padding: "16px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: "var(--cream-dim)", marginBottom: 4 }}>Per person budget</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "var(--gold)" }}>
            ₹{(budgetType === "per_person" ? budget : Math.round(budget / members)).toLocaleString("en-IN")}
          </div>
        </div>
      )}

      <button
        onClick={onConfirm}
        disabled={!destination || loading}
        style={{
          width: "100%", padding: "18px", background: destination ? "var(--gold)" : "var(--muted)",
          border: "none", color: destination ? "var(--obsidian)" : "var(--cream-dim)",
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase",
          cursor: destination ? "pointer" : "not-allowed", fontWeight: 500, transition: "all 0.3s ease",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
        onMouseEnter={(e) => { if (destination) e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
      >
        {loading ? "Building Itinerary..." : <>Build Itinerary <ArrowRight size={16} /></>}
      </button>

      {!destination && (
        <p style={{ fontSize: 11, color: "var(--cream-dim)", textAlign: "center", marginTop: 12, letterSpacing: 1 }}>
          Select a destination to continue
        </p>
      )}
    </div>
  );
}

// ─── Plan Page ────────────────────────────────────────────────────────────────
export default function PlanPage() {
  const navigate = useNavigate();
  const {
    destination, setDestination,
    members, setMembers,
    budget, setBudget,
    budgetType, setBudgetType,
    dateRange, setDateRange,
    selectedActivities, toggleActivity,
    tripName, setTripName,
  } = useTripStore();

  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (destination) {
      fetchWeather(destination.name).then(setWeather);
    }
  }, [destination]);

  const handleConfirm = async () => {
    if (!destination) return toast.error("Please select a destination");
    if (!dateRange.start) return toast.error("Please select travel dates");
    if (selectedActivities.length === 0) return toast.error("Please select at least one activity");

    setLoading(true);
    toast.success("Building your premium itinerary...");
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    navigate(`/itinerary/${destination.id}`);
  };

  return (
    <div style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        padding: "24px 48px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,11,0.95)", backdropFilter: "blur(20px)",
      }}>
        <button
          onClick={() => navigate("/")}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--cream-dim)", cursor: "pointer", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cream-dim)")}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 24, height: 24, border: "1px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(45deg)" }}>
            <Compass size={12} color="var(--gold)" style={{ transform: "rotate(-45deg)" }} />
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, letterSpacing: 3, color: "var(--cream)" }}>
            LUXE<span style={{ color: "var(--gold)" }}>TREK</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {weather && (
            <div style={{ fontSize: 13, color: "var(--cream-dim)", display: "flex", alignItems: "center", gap: 8 }}>
              <span>{weather.temp}°C</span>
              <span style={{ color: "var(--border)" }}>·</span>
              <span>{destination?.name}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 0, maxWidth: 1200, margin: "0 auto", padding: "60px 48px", alignItems: "start" }}>
        {/* Left: Form */}
        <div style={{ paddingRight: 60 }}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 11, letterSpacing: 6, color: "var(--gold)", textTransform: "uppercase", marginBottom: 16 }}>Configure Your Trip</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 300, color: "var(--cream)", lineHeight: 1.1, marginBottom: 16 }}>
              Tell us what you<br /><em style={{ color: "var(--gold)" }}>want.</em>
            </h1>
            <p style={{ fontSize: 15, color: "var(--cream-dim)", fontWeight: 300 }}>We'll take care of every detail.</p>
          </div>

          {/* Trip Name */}
          <div style={{ marginBottom: 48 }}>
            <label style={{ fontSize: 11, letterSpacing: 3, color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: 12 }}>Trip Name (optional)</label>
            <input
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="e.g. Q4 Team Offsite — Rishikesh"
              className="premium-input"
              style={{ width: "100%", padding: "16px 20px", fontSize: 15, borderRadius: 0 }}
            />
          </div>

          <div style={{ height: 1, background: "var(--border)", marginBottom: 48 }} />

          <div style={{ marginBottom: 48 }}>
            <DestinationStep value={destination} onChange={setDestination} />
          </div>

          <div style={{ height: 1, background: "var(--border)", marginBottom: 48 }} />

          <div style={{ marginBottom: 48 }}>
            <MembersStep value={members} onChange={setMembers} />
          </div>

          <div style={{ height: 1, background: "var(--border)", marginBottom: 48 }} />

          <div style={{ marginBottom: 48 }}>
            <BudgetStep value={budget} type={budgetType} onValueChange={setBudget} onTypeChange={setBudgetType} />
          </div>

          <div style={{ height: 1, background: "var(--border)", marginBottom: 48 }} />

          <div style={{ marginBottom: 48 }}>
            <DateStep value={dateRange} onChange={setDateRange} />
          </div>

          <div style={{ height: 1, background: "var(--border)", marginBottom: 48 }} />

          <div style={{ marginBottom: 48 }}>
            <ActivitiesStep value={selectedActivities} onToggle={toggleActivity} />
          </div>
        </div>

        {/* Right: Summary */}
        <SummaryPanel
          destination={destination}
          members={members}
          budget={budget}
          budgetType={budgetType}
          dateRange={dateRange}
          activities={selectedActivities}
          onConfirm={handleConfirm}
          loading={loading}
        />
      </div>
    </div>
  );
}
