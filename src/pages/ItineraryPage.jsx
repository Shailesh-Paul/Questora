import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTripStore from "../store/tripStore";
import { MOCK_HOTELS, MOCK_ACTIVITIES } from "../lib/api";
import { ArrowLeft, Star, Clock, Users, ShoppingCart, Compass } from "lucide-react";
import toast from "react-hot-toast";

export default function ItineraryPage() {
  const navigate = useNavigate();
  const { destination: destId } = useParams();
  const { destination, members, budget, selectedActivities, addToCart, cart } = useTripStore();
  const nights = 2;

  const inCart = (id) => cart.some((i) => i.id === id);

  const handleAdd = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to itinerary`);
  };

  return (
    <div style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
      {/* Nav */}
      <div style={{ padding: "24px 48px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,11,0.95)", backdropFilter: "blur(20px)" }}>
        <button onClick={() => navigate("/plan")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--cream-dim)", cursor: "pointer", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
          <ArrowLeft size={16} /> Back
        </button>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, letterSpacing: 3, color: "var(--cream)" }}>LUXE<span style={{ color: "var(--gold)" }}>TREK</span></span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", border: "1px solid var(--gold)", color: "var(--gold)", fontSize: 13, cursor: "pointer" }} onClick={() => navigate("/booking")}>
          <ShoppingCart size={14} /> {cart.length} items
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: "relative", height: 400, overflow: "hidden" }}>
        <img src={destination?.image || "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,11,1) 0%, rgba(10,10,11,0.3) 60%, transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: 48, left: 48 }}>
          <p style={{ fontSize: 11, letterSpacing: 6, color: "var(--gold)", textTransform: "uppercase", marginBottom: 8 }}>Your Curated Itinerary</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 64, fontWeight: 300, color: "var(--cream)", lineHeight: 1 }}>{destination?.name || "Rishikesh"}</h1>
          <p style={{ fontSize: 14, color: "var(--cream-dim)", marginTop: 8 }}>{members} travelers · {nights} nights · ₹{budget?.toLocaleString("en-IN")} / person</p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 48px" }}>
        {/* Hotels */}
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 11, letterSpacing: 4, color: "var(--gold)", textTransform: "uppercase", marginBottom: 8 }}>Recommended Stays</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, color: "var(--cream)", marginBottom: 32, fontWeight: 300 }}>Select Your Hotel</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {MOCK_HOTELS.map((hotel) => (
              <div key={hotel.id} style={{ background: "var(--carbon)", border: `1px solid ${inCart(hotel.id) ? "var(--gold)" : "var(--border)"}`, overflow: "hidden", transition: "all 0.3s" }}>
                <div style={{ height: 180, overflow: "hidden" }}>
                  <img src={hotel.image} alt={hotel.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }} />
                </div>
                <div style={{ padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "var(--cream)", fontWeight: 400 }}>{hotel.name}</h3>
                    <div style={{ display: "flex", gap: 2 }}>
                      {Array.from({ length: hotel.stars }).map((_, i) => <Star key={i} size={10} fill="var(--gold)" color="var(--gold)" />)}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {hotel.amenities.map((a) => (
                      <span key={a} style={{ fontSize: 10, color: "var(--cream-dim)", padding: "3px 10px", border: "1px solid var(--border)", letterSpacing: 1 }}>{a}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "var(--gold)" }}>₹{hotel.price.toLocaleString("en-IN")}</span>
                      <span style={{ fontSize: 12, color: "var(--cream-dim)" }}> /night</span>
                    </div>
                    <button
                      onClick={() => !inCart(hotel.id) && handleAdd({ ...hotel, type: "hotel", price: hotel.price * nights })}
                      style={{
                        padding: "8px 20px", border: `1px solid ${inCart(hotel.id) ? "var(--gold)" : "var(--border)"}`,
                        background: inCart(hotel.id) ? "rgba(201,168,76,0.1)" : "transparent",
                        color: inCart(hotel.id) ? "var(--gold)" : "var(--cream-dim)",
                        fontSize: 12, cursor: "pointer", letterSpacing: 1, fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {inCart(hotel.id) ? "✓ Added" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 11, letterSpacing: 4, color: "var(--gold)", textTransform: "uppercase", marginBottom: 8 }}>Experiences</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, color: "var(--cream)", marginBottom: 32, fontWeight: 300 }}>Activities & Adventures</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {MOCK_ACTIVITIES.map((act) => (
              <div key={act.id} style={{ background: "var(--carbon)", border: `1px solid ${inCart(act.id) ? "var(--gold)" : "var(--border)"}`, padding: "24px", transition: "all 0.3s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <span style={{ fontSize: 10, letterSpacing: 2, color: "var(--sage)", textTransform: "uppercase", padding: "4px 10px", border: "1px solid rgba(122,158,126,0.3)" }}>{act.category}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Star size={10} fill="var(--gold)" color="var(--gold)" />
                    <span style={{ fontSize: 12, color: "var(--gold)" }}>{act.rating}</span>
                  </div>
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "var(--cream)", marginBottom: 8, fontWeight: 400 }}>{act.name}</h3>
                <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--cream-dim)" }}>
                    <Clock size={12} /> {act.duration}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--cream-dim)" }}>
                    <Users size={12} /> {act.slots} slots
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "var(--gold)" }}>₹{act.price.toLocaleString("en-IN")}</span>
                    <span style={{ fontSize: 12, color: "var(--cream-dim)" }}> /person</span>
                  </div>
                  <button
                    onClick={() => !inCart(act.id) && handleAdd({ ...act, type: "activity", price: act.price * members })}
                    style={{
                      padding: "8px 20px", border: `1px solid ${inCart(act.id) ? "var(--gold)" : "var(--border)"}`,
                      background: inCart(act.id) ? "rgba(201,168,76,0.1)" : "transparent",
                      color: inCart(act.id) ? "var(--gold)" : "var(--cream-dim)",
                      fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {inCart(act.id) ? "✓ Added" : "Book"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {cart.length > 0 && (
          <div style={{ padding: "32px", background: "var(--carbon)", border: "1px solid var(--gold)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 12, color: "var(--cream-dim)", letterSpacing: 2, marginBottom: 4, textTransform: "uppercase" }}>Your selection</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "var(--cream)" }}>
                ₹{cart.reduce((s, i) => s + i.price, 0).toLocaleString("en-IN")} total
                <span style={{ fontSize: 16, color: "var(--gold)", marginLeft: 12 }}>· ₹{Math.round(cart.reduce((s, i) => s + i.price, 0) / members).toLocaleString("en-IN")}/person</span>
              </p>
            </div>
            <button
              onClick={() => navigate("/booking")}
              style={{ padding: "16px 40px", background: "var(--gold)", border: "none", color: "var(--obsidian)", fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontWeight: 500 }}
            >
              Proceed to Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
