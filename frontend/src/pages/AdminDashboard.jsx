import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Car, ShieldCheck, TrendingUp, AlertCircle, CheckCircle2, XCircle, 
  Search, Filter, MoreVertical, LayoutDashboard, Settings, LogOut, 
  CreditCard, Map, Activity, MessageSquare, ShieldAlert
} from "lucide-react";
import { 
  fetchPlatformStats, fetchAllUsers, fetchPendingProviders, verifyProviderAdmin, 
  fetchPendingVehicles, verifyVehicleAdmin, updatePlatformUser, fetchItineraryBookings
} from "../lib/api";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token] = useState(JSON.parse(localStorage.getItem("user"))?.token);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await fetchPlatformStats(token);
      setStats(data);
    } catch (err) {
      toast.error("Failed to load platform stats");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={20} /> },
    { id: "users", label: "User Management", icon: <Users size={20} /> },
    { id: "providers", label: "Verification Requests", icon: <ShieldCheck size={20} /> },
    { id: "listings", label: "Vehicle Approvals", icon: <Car size={20} /> },
    { id: "itinerary", label: "Itinerary Bookings", icon: <Map size={20} /> },
    { id: "settings", label: "Global Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar scrolled={true} />
      
      <div className="flex pt-24 min-h-screen">
        {/* Sidebar */}
        <aside className="w-72 bg-white/5 border-r border-white/10 p-8 hidden lg:block sticky top-24 h-[calc(100vh-6rem)]">
          <div className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500 mb-2">Master Control</p>
            <h2 className="text-2xl font-black tracking-tighter">Admin <span className="text-orange-500">Panel</span></h2>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                  activeTab === item.id 
                    ? "bg-orange-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.3)]" 
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
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && <Overview stats={stats} loading={loading} />}
            {activeTab === "users" && <UserManagement token={token} />}
            {activeTab === "providers" && <ProviderApprovals token={token} />}
            {activeTab === "listings" && <VehicleApprovals token={token} />}
            {activeTab === "itinerary" && <ItineraryBookings token={token} />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function Overview({ stats, loading }) {
  if (loading) return <div className="text-white/40">Calculating platform metrics...</div>;

  const cards = [
    { label: "Total Revenue", value: `₹${stats?.revenue?.toLocaleString()}`, icon: <CreditCard />, color: "bg-blue-500" },
    { label: "Active Users", value: stats?.totalUsers, icon: <Users />, color: "bg-orange-500" },
    { label: "Total Bookings", value: stats?.totalBookings, icon: <Activity />, color: "bg-emerald-500" },
    { label: "Verified Vehicles", value: stats?.totalVehicles, icon: <Car />, color: "bg-purple-500" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${card.color} opacity-10 blur-3xl group-hover:scale-150 transition-transform`} />
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 ${card.color} rounded-2xl`}>{React.cloneElement(card.icon, { size: 24 })}</div>
              <TrendingUp className="text-white/20" size={20} />
            </div>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-1">{card.label}</p>
            <h3 className="text-3xl font-black">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Real-time Activity Feed Mock */}
      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <ShieldAlert className="text-orange-500" /> Suspicious Activity Monitoring
        </h3>
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="font-bold">Duplicate Document Detected</p>
                  <p className="text-xs text-white/40">User ID: #88291 uploaded RC already assigned to another provider.</p>
                </div>
              </div>
              <button className="px-6 py-3 bg-white/5 rounded-xl text-xs font-bold hover:bg-white/10 transition-all uppercase tracking-widest">Investigate</button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function UserManagement({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await fetchAllUsers(token);
    setUsers(data);
    setLoading(false);
  };

  const handleDeactivate = async (id) => {
    await updatePlatformUser(id, 'banned', token);
    toast.success("User deactivated successfully");
    loadUsers();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-black tracking-tight">User <span className="text-orange-500">Database</span></h2>
        <div className="flex gap-4">
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
            <Search size={18} className="text-white/40" />
            <input placeholder="Search users..." className="bg-transparent border-none outline-none text-sm w-48" />
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-8 text-xs font-bold uppercase tracking-widest text-white/40">User</th>
              <th className="p-8 text-xs font-bold uppercase tracking-widest text-white/40">Role</th>
              <th className="p-8 text-xs font-bold uppercase tracking-widest text-white/40">Status</th>
              <th className="p-8 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all group">
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center font-bold text-orange-500 uppercase">{u.name[0]}</div>
                    <div>
                      <p className="font-bold">{u.name}</p>
                      <p className="text-xs text-white/40">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                    u.role === 'admin' ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"
                  }`}>{u.role}</span>
                </td>
                <td className="p-8">
                  <span className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                  </span>
                </td>
                <td className="p-8 text-right">
                  <button onClick={() => handleDeactivate(u._id)} className="p-3 text-white/20 hover:text-rose-500 transition-colors"><XCircle size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function ProviderApprovals({ token }) {
  const [requests, setRequests] = useState([]);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const data = await fetchPendingProviders(token);
    setRequests(data);
  };

  const handleAction = async (id, status) => {
    await verifyProviderAdmin(id, status, remarks, token);
    toast.success(`Application ${status.toLowerCase()}`);
    loadRequests();
    setRemarks("");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h2 className="text-4xl font-black tracking-tight">Verification <span className="text-orange-500">Requests</span></h2>
      
      {requests.length === 0 ? (
        <div className="py-20 text-center bg-white/5 border border-white/10 rounded-[3rem]">
          <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-6 opacity-40" />
          <h3 className="text-2xl font-bold">All caught up!</h3>
          <p className="text-white/40">No pending verification requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {requests.map(r => (
            <div key={r._id} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-8 relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-orange-500/10 flex items-center justify-center font-bold text-orange-500 text-2xl uppercase">{r.userId?.name?.[0]}</div>
                  <div>
                    <h4 className="text-xl font-bold">{r.userId?.name}</h4>
                    <p className="text-sm text-white/40">{r.userId?.email}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mt-2 bg-orange-500/10 px-3 py-1 rounded-full inline-block">{r.documentType}</p>
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl text-white/20"><MoreVertical /></div>
              </div>

              <div className="aspect-video bg-black/40 rounded-[2rem] overflow-hidden border border-white/5 relative group/img">
                <img src={r.uploadedDocument} className="w-full h-full object-cover opacity-60 group-hover/img:scale-110 transition-transform duration-700" alt="Document" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                  <button className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl">View Document</button>
                </div>
              </div>

              <div className="space-y-4">
                <textarea 
                  value={remarks} onChange={e => setRemarks(e.target.value)}
                  placeholder="Add admin remarks (reason for rejection or approval notes)..."
                  className="w-full bg-white/5 border border-white/10 p-6 rounded-[1.5rem] text-sm outline-none focus:border-orange-500/50 transition-all h-32"
                />
                <div className="flex gap-4">
                  <button onClick={() => handleAction(r._id, 'Approved')} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">Verify & Approve</button>
                  <button onClick={() => handleAction(r._id, 'Rejected')} className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">Reject Application</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function VehicleApprovals({ token }) {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const data = await fetchPendingVehicles(token);
    setVehicles(data);
  };

  const handleAction = async (id, status) => {
    await verifyVehicleAdmin(id, status, token);
    toast.success(`Listing ${status.toLowerCase()}`);
    loadVehicles();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h2 className="text-4xl font-black tracking-tight">Vehicle <span className="text-orange-500">Approvals</span></h2>
      
      {vehicles.length === 0 ? (
        <div className="py-20 text-center bg-white/5 border border-white/10 rounded-[3rem]">
          <Car size={48} className="mx-auto text-blue-500 mb-6 opacity-40" />
          <h3 className="text-2xl font-bold">No Pending Listings</h3>
          <p className="text-white/40">Providers are quiet today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {vehicles.map(v => (
            <div key={v._id} className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <img src={v.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Vehicle" />
                <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{v.category}</span>
                </div>
              </div>
              <div className="p-10 space-y-6">
                <div>
                  <h4 className="text-2xl font-bold mb-1">{v.name}</h4>
                  <p className="text-sm text-white/40 flex items-center gap-2"><MapPin size={14} /> {v.pickupLocation}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest mb-1">Rate</p>
                    <p className="text-sm font-bold">₹{v.hourlyPrice}/hr</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest mb-1">Condition</p>
                    <p className="text-sm font-bold">{v.condition}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest mb-1">Provider</p>
                    <p className="text-sm font-bold line-clamp-1">{v.ownerId?.name}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/5">
                  <button onClick={() => handleAction(v._id, 'Approved')} className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">Go Live</button>
                  <button onClick={() => handleAction(v._id, 'Rejected')} className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">Reject Listing</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function MapPin({ size, className }) {
  return <Map size={size} className={className} />;
}

function ItineraryBookings({ token }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await fetchItineraryBookings(token);
      setBookings(data);
    } catch (err) {
      toast.error("Failed to load itinerary bookings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <h2 className="text-4xl font-black tracking-tight">Itinerary <span className="text-orange-500">Bookings</span></h2>

      <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/40">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-white/40 font-bold text-lg">No itinerary bookings found.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-8 text-xs font-bold uppercase tracking-widest text-white/40">User</th>
                <th className="p-8 text-xs font-bold uppercase tracking-widest text-white/40">Activity Booked</th>
                <th className="p-8 text-xs font-bold uppercase tracking-widest text-white/40">Destination</th>
                <th className="p-8 text-xs font-bold uppercase tracking-widest text-white/40">Dates</th>
                <th className="p-8 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Advance Paid</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all group">
                  <td className="p-8">
                    <p className="font-bold">{b.userId?.name || 'Unknown User'}</p>
                    <p className="text-xs text-white/40">{b.userPhoneNumber}</p>
                  </td>
                  <td className="p-8">
                    <p className="font-bold text-orange-400">{b.itemName || 'Activity'}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Qty: {b.quantityBooked}</p>
                  </td>
                  <td className="p-8">
                    <span className="capitalize">{b.destinationId}</span>
                  </td>
                  <td className="p-8">
                    <p className="text-xs">{new Date(b.startDate).toLocaleDateString()} -</p>
                    <p className="text-xs">{new Date(b.endDate).toLocaleDateString()}</p>
                  </td>
                  <td className="p-8 text-right">
                    <p className="text-xl font-black text-emerald-400">₹{b.price?.toLocaleString("en-IN")}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
