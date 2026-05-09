import React, { useState } from "react";
import { X, Upload, CheckCircle, Loader2, Home, Wifi, Coffee, Wind, Car, Users, Bed, Bath } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AMENITIES = [
  { id: "wifi", label: "Free WiFi", icon: <Wifi size={16} /> },
  { id: "ac", label: "Air Conditioning", icon: <Wind size={16} /> },
  { id: "kitchen", label: "Kitchen", icon: <Coffee size={16} /> },
  { id: "parking", label: "Parking Area", icon: <Car size={16} /> },
];

export default function ListingModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    category: "Stay",
    contact: "",
    ownerName: "",
    maxGuests: "",
    bedrooms: "",
    bathrooms: "",
  });
  const [facilities, setFacilities] = useState([]);
  const [hasParking, setHasParking] = useState(false);
  const [images, setImages] = useState([]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFacilityToggle = (id) => {
    setFacilities((prev) => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    
    data.append("facilities", JSON.stringify(facilities));
    data.append("hasParking", hasParking);

    images.forEach((image) => {
      data.append("images", image);
    });

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      await axios.post(`${apiUrl}/api/listings`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      toast.success("Property listed successfully!");
      setTimeout(() => {
        onClose();
        setSuccess(false);
        resetForm();
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to list property. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      price: "",
      category: "Stay",
      contact: "",
      ownerName: "",
      maxGuests: "",
      bedrooms: "",
      bathrooms: "",
    });
    setFacilities([]);
    setHasParking(false);
    setImages([]);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-slate-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-fadeUp flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md p-8 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Home size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#ebe7e1] tracking-tight">Host Your Escape</h2>
              <p className="text-white/40 text-xs uppercase tracking-widest mt-0.5">Step into the Questora Market</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-all"
          >
            <span className="text-xs font-bold text-white/60 group-hover:text-white uppercase tracking-wider">Back to Home</span>
            <X size={20} className="text-white/60 group-hover:text-white" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {success ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-8 animate-bounce">
                <CheckCircle size={56} />
              </div>
              <h3 className="text-3xl font-black text-white mb-4">You're Now a Host!</h3>
              <p className="text-white/40 text-lg max-w-sm">Your property has been listed. Get ready for some weekend wanderers!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Section 1: Basic Info */}
              <div className="space-y-6">
                <h3 className="text-orange-400 font-bold text-sm uppercase tracking-[0.2em]">01. Basic Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Property Name</label>
                    <input 
                      required name="title" value={formData.title} onChange={handleInputChange}
                      placeholder="e.g. Zen Mountain Villa"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-[#ebe7e1] focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Location / City</label>
                    <input 
                      required name="location" value={formData.location} onChange={handleInputChange}
                      placeholder="e.g. Manali, Himachal"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-[#ebe7e1] focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-white/10"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Rent per Weekend (₹)</label>
                    <input 
                      required type="number" name="price" value={formData.price} onChange={handleInputChange}
                      placeholder="4500"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-[#ebe7e1] focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Category</label>
                    <div className="relative">
                      <select 
                        name="category" value={formData.category} onChange={handleInputChange}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-[#ebe7e1] focus:outline-none focus:border-orange-500/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="Stay">🏠 Homestay / Villa</option>
                        <option value="Transport">🛵 Bike / Car Rental</option>
                        <option value="Activities">🛶 Adventure Activity</option>
                        <option value="Food">🍲 Local Kitchen</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">▼</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Capacity & Facilities */}
              <div className="space-y-6">
                <h3 className="text-orange-400 font-bold text-sm uppercase tracking-[0.2em]">02. Amenities & Capacity</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white/40 mb-1">
                      <Users size={14} /> <span className="text-[10px] font-bold uppercase tracking-wider">Guests</span>
                    </div>
                    <input 
                      type="number" name="maxGuests" value={formData.maxGuests} onChange={handleInputChange}
                      placeholder="4"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-center"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white/40 mb-1">
                      <Bed size={14} /> <span className="text-[10px] font-bold uppercase tracking-wider">Beds</span>
                    </div>
                    <input 
                      type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange}
                      placeholder="2"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-center"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white/40 mb-1">
                      <Bath size={14} /> <span className="text-[10px] font-bold uppercase tracking-wider">Baths</span>
                    </div>
                    <input 
                      type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange}
                      placeholder="1"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-center"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Facilities Available</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {AMENITIES.map((amenity) => (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => handleFacilityToggle(amenity.id)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                          facilities.includes(amenity.id)
                            ? "bg-orange-500/10 border-orange-500/50 text-orange-300 shadow-lg shadow-orange-500/5"
                            : "bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5"
                        }`}
                      >
                        {amenity.icon}
                        <span className="text-xs font-semibold">{amenity.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3: Media & Contact */}
              <div className="space-y-6">
                <h3 className="text-orange-400 font-bold text-sm uppercase tracking-[0.2em]">03. Photos & Contact</h3>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Upload Photos (Add 2 or more)</label>
                  <div className="relative group">
                    <input 
                      type="file" multiple onChange={handleImageChange}
                      className="hidden" id="image-upload" 
                    />
                    <label 
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-white/10 rounded-[2rem] cursor-pointer bg-white/[0.02] group-hover:bg-white/[0.05] group-hover:border-orange-500/30 transition-all overflow-hidden"
                    >
                      <div className="relative z-10 flex flex-col items-center">
                        <Upload className="text-orange-400 mb-3" size={32} />
                        <span className="text-sm font-bold text-[#ebe7e1]">
                          {images.length > 0 ? `${images.length} Photos Selected` : "Select Property Photos"}
                        </span>
                        <span className="text-[10px] text-white/20 uppercase tracking-widest mt-2">JPG, PNG up to 10MB each</span>
                      </div>
                      
                      {images.length > 0 && (
                        <div className="absolute inset-0 bg-orange-500/5 backdrop-blur-[2px]" />
                      )}
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Owner Name</label>
                    <input 
                      required name="ownerName" value={formData.ownerName} onChange={handleInputChange}
                      placeholder="Your Full Name"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-[#ebe7e1] focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">WhatsApp / Contact</label>
                    <input 
                      required name="contact" value={formData.contact} onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-[#ebe7e1] focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-white/10"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-black text-lg rounded-[1.5rem] shadow-[0_15px_50px_rgba(249,115,22,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 uppercase tracking-widest"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      Processing Listing...
                    </>
                  ) : (
                    "Publish Listing"
                  )}
                </button>
                <p className="text-center text-[10px] text-white/20 mt-4 uppercase tracking-[0.3em]">By listing, you agree to direct contact with travelers.</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
