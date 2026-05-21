import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Car, Calendar, DollarSign, Star, Plus, Settings, LogOut, 
  CheckCircle2, Clock, MapPin, Fuel, ShieldCheck, AlertCircle, ChevronRight
} from "lucide-react";
import { fetchVehicles, createVehicle, updateVehicleStatus, getProviderStatus } from "../lib/api";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import axios from "axios";
import { API_BASE_URL } from "../config";


export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("vehicles");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [token] = useState(JSON.parse(localStorage.getItem("user"))?.token);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const data = await fetchVehicles({ ownerId: user._id });
      setVehicles(data);
    } catch (err) {
      toast.error("Failed to load your vehicles");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: "vehicles", label: "My Fleet", icon: <Car size={20} /> },
    { id: "bookings", label: "Bookings", icon: <Calendar size={20} /> },
    { id: "earnings", label: "Earnings", icon: <DollarSign size={20} /> },
    { id: "reviews", label: "Reviews", icon: <Star size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar scrolled={true} />
      
      <div className="flex pt-24 min-h-screen">
        {/* Sidebar */}
        <aside className="w-72 bg-white/5 border-r border-white/10 p-8 hidden lg:block sticky top-24 h-[calc(100vh-6rem)]">
          <div className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500 mb-2">Verified Provider</p>
            <h2 className="text-2xl font-black tracking-tighter">Owner <span className="text-blue-500">Portal</span></h2>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                  activeTab === item.id 
                    ? "bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]" 
                    : "text-white/40 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-8 left-8 right-8">
            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-rose-400 hover:bg-rose-500/10 transition-all">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 lg:p-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tight capitalize">{activeTab} <span className="text-blue-500">Center</span></h2>
              <p className="text-white/40 mt-2 text-sm">Manage your vehicle business and track performance.</p>
            </div>
            {activeTab === "vehicles" && (
              <button 
                onClick={() => setShowAddVehicle(true)}
                className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-blue-500/20"
              >
                <Plus size={18} /> Add New Vehicle
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "vehicles" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {vehicles.length === 0 ? (
                  <div className="col-span-2 py-20 text-center bg-white/5 border border-white/10 rounded-[3rem]">
                    <Car size={48} className="mx-auto text-blue-500 mb-6 opacity-40" />
                    <h3 className="text-2xl font-bold">No vehicles listed yet</h3>
                    <p className="text-white/40 mb-8">Start your journey by adding your first vehicle.</p>
                  </div>
                ) : (
                  vehicles.map(v => <VehicleProviderCard key={v._id} vehicle={v} token={token} onRefresh={loadVehicles} />)
                )}
              </motion.div>
            )}

            {activeTab === "bookings" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <BookingVerification token={token} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {showAddVehicle && (
          <AddVehicleModal onClose={() => setShowAddVehicle(false)} onRefresh={loadVehicles} token={token} />
        )}
      </AnimatePresence>
    </div>
  );
}

function BookingVerification({ token }) {
  const [otp, setOtp] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Find the booking ID somehow (e.g. by customer email or recent)
      // For simplicity, we'll assume the provider has a list or enters ID
      await axios.patch(`${API_BASE_URL}/bookings/${bookingId}/verify-otp`, { otp }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Vehicle Pickup Verified!");
      setOtp("");
      setBookingId("");
    } catch (err) {
      toast.error("Invalid OTP or Booking ID");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-orange-500/20 text-orange-400 rounded-2xl"><ShieldCheck size={24} /></div>
        <h3 className="text-2xl font-bold">Verify Pickup</h3>
      </div>
      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Booking ID</label>
          <input required value={bookingId} onChange={e => setBookingId(e.target.value)} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl" placeholder="Enter Booking ID (from customer)" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Verification OTP</label>
          <input required maxLength={4} value={otp} onChange={e => setOtp(e.target.value)} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-2xl font-black tracking-[0.5em] text-center" placeholder="0000" />
        </div>
        <button type="submit" disabled={loading} className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all">
          {loading ? "Verifying..." : "Confirm Handover"}
        </button>
      </form>
    </div>
  );
}


function VehicleProviderCard({ vehicle, token, onRefresh }) {
  const toggleStatus = async () => {
    try {
      await updateVehicleStatus(vehicle._id, !vehicle.availabilityStatus, token);
      toast.success("Availability updated");
      onRefresh();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden group">
      <div className="relative h-56">
        <img src={vehicle.images?.[0]} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" alt="Vehicle" />
        <div className="absolute top-6 left-6 flex gap-2">
          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
            vehicle.approvalStatus === 'Approved' ? "bg-emerald-500/20 text-emerald-400" : "bg-orange-500/20 text-orange-400"
          }`}>
            {vehicle.approvalStatus}
          </span>
          <span className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
            {vehicle.category}
          </span>
        </div>
      </div>
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="text-2xl font-bold mb-1">{vehicle.name}</h4>
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <MapPin size={14} /> {vehicle.pickupLocation}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-400">₹{vehicle.hourlyPrice}</p>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">per hour</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
            <Fuel size={18} className="text-blue-400" />
            <div>
              <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest">Fuel</p>
              <p className="text-xs font-bold">{vehicle.fuelType || 'Petrol'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
            <ShieldCheck size={18} className="text-blue-400" />
            <div>
              <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest">Condition</p>
              <p className="text-xs font-bold">{vehicle.condition || 'Good'}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${vehicle.availabilityStatus ? "bg-emerald-500" : "bg-rose-500"}`} />
            <span className="text-xs font-bold uppercase tracking-widest">{vehicle.availabilityStatus ? "Accepting Bookings" : "Paused"}</span>
          </div>
          <button 
            onClick={toggleStatus}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              vehicle.availabilityStatus ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20" : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            {vehicle.availabilityStatus ? "Pause" : "Resume"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddVehicleModal({ onClose, onRefresh, token }) {
  const [formData, setFormData] = useState({
    name: "", category: "Bike", hourlyPrice: "", pickupLocation: "", condition: "Excellent",
    fuelType: "Petrol", transmissionType: "Manual", images: "", mileage: "", seatingCapacity: 2,
    lat: 15.5, lng: 73.8
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        geometry: { coordinates: [Number(formData.lng), Number(formData.lat)] },
        images: [formData.images]
      };
      await createVehicle(payload, token);
      toast.success("Vehicle listed! Awaiting admin approval.");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error("Failed to list vehicle");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#0A0F1D] border border-white/10 w-full max-w-4xl rounded-[3rem] p-12 relative my-12">
        <h2 className="text-4xl font-black mb-2">Add New <span className="text-blue-500">Vehicle</span></h2>
        <p className="text-white/40 mb-10 text-sm">Provide accurate details for a faster approval process.</p>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Vehicle Name</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500/50" placeholder="e.g. Royal Enfield Himalayan 450" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Category</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#0A0F1D] border border-white/10 p-5 rounded-2xl">
              <option>Bike</option><option>Scooty</option><option>Car</option><option>Cycle</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Hourly Rate (₹)</label>
            <input required type="number" value={formData.hourlyPrice} onChange={e => setFormData({...formData, hourlyPrice: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl" placeholder="100" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Condition</label>
            <select value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} className="w-full bg-[#0A0F1D] border border-white/10 p-5 rounded-2xl">
              <option>Excellent</option><option>Good</option><option>Average</option><option>Needs Maintenance</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Fuel Type</label>
            <select value={formData.fuelType} onChange={e => setFormData({...formData, fuelType: e.target.value})} className="w-full bg-[#0A0F1D] border border-white/10 p-5 rounded-2xl">
              <option>Petrol</option><option>Diesel</option><option>Electric</option><option>None</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Pickup Location Address</label>
            <input required value={formData.pickupLocation} onChange={e => setFormData({...formData, pickupLocation: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl" placeholder="Full address for customer pickup" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Seating Capacity</label>
            <input type="number" value={formData.seatingCapacity} onChange={e => setFormData({...formData, seatingCapacity: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl" />
          </div>
          <div className="lg:col-span-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Image URL</label>
            <input required value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl" placeholder="https://..." />
          </div>

          <div className="lg:col-span-3 flex gap-4 mt-6">
            <button type="submit" className="flex-1 py-5 bg-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl">List Vehicle</button>
            <button type="button" onClick={onClose} className="px-10 py-5 bg-white/5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">Cancel</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
