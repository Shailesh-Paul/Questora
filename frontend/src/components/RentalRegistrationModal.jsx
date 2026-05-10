import React, { useState, useRef } from "react";
import { X, Camera, Upload, CheckCircle2, AlertCircle, Trash2, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function RentalRegistrationModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "Bikes",
    vehicleNumber: "",
    vehicleModel: "",
    pricingType: "hourly",
    hourlyPrice: "",
    dailyPrice: "",
    ownerName: "",
    contact: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 5) {
      toast.error("Max 5 images allowed");
      return;
    }

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      // Add price fallback for model compatibility
      data.append('price', formData.hourlyPrice || formData.dailyPrice || 0);
      
      imageFiles.forEach(file => {
        data.append('images', file);
      });

      const response = await axios.post("http://localhost:5000/api/listings", data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success("Vehicle Registered Successfully!", {
        style: { background: '#1A1A1E', color: '#fff', border: '1px solid #22c55e' }
      });
      
      onSuccess?.();
      onClose();
      resetForm();
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.error || "Failed to register. Please try again.";
      toast.error(errorMsg);
      console.error("Registration Error Details:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      category: "Bikes",
      vehicleNumber: "",
      vehicleModel: "",
      pricingType: "hourly",
      hourlyPrice: "",
      dailyPrice: "",
      ownerName: "",
      contact: "",
    });
    setImageFiles([]);
    setPreviews([]);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#0a0c1a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
        
        <div className="p-8 sm:p-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-black font-display text-white mb-2">Register Vehicle</h2>
              <p className="text-white/40 text-sm">Fill in the details to start earning from your vehicle.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/50">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Vehicle Title</label>
                  <input 
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Royal Enfield Himalayan 2023"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-orange-500/50 focus:bg-white/10 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Vehicle Model</label>
                  <input 
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    placeholder="e.g. Himalayan BS6"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-orange-500/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Vehicle Number</label>
                  <input 
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    placeholder="e.g. GA 01 AB 1234"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-orange-500/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-orange-500/50 outline-none transition-all appearance-none"
                  >
                    <option value="Bikes" className="bg-[#0a0c1a]">Bikes</option>
                    <option value="Cars" className="bg-[#0a0c1a]">Cars</option>
                    <option value="Scooters" className="bg-[#0a0c1a]">Scooters</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Location</label>
                  <input 
                    required
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Goa, Rishikesh"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-orange-500/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Pricing Type</label>
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                    <button 
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, pricingType: 'hourly' }))}
                      className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${formData.pricingType === 'hourly' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/30'}`}
                    >
                      Hourly
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, pricingType: 'daily' }))}
                      className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${formData.pricingType === 'daily' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/30'}`}
                    >
                      Daily
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Price (₹)</label>
                  <input 
                    required
                    type="number"
                    name={formData.pricingType === 'hourly' ? 'hourlyPrice' : 'dailyPrice'}
                    value={formData.pricingType === 'hourly' ? formData.hourlyPrice : formData.dailyPrice}
                    onChange={handleChange}
                    placeholder={formData.pricingType === 'hourly' ? "Price per hour" : "Price per day"}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-orange-500/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Description (Optional)</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell us about your vehicle..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-orange-500/50 outline-none transition-all min-h-[100px] resize-none"
                  />
                </div>

                <button 
                  type="button"
                  onClick={() => setStep(2)}
                  className="sm:col-span-2 w-full py-5 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95 mt-4"
                >
                  Next: Contact Details
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Owner Name</label>
                    <input 
                      required
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Your Full Name"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-orange-500/50 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Contact Number</label>
                    <input 
                      required
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder="e.g. +91 9876543210"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-orange-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Vehicle Images</label>
                  
                  <input 
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />

                  {previews.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {previews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                          <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                          <button 
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      {previews.length < 5 && (
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                          className="aspect-square rounded-xl border border-dashed border-white/20 flex items-center justify-center text-white/40 hover:border-orange-500/50 hover:text-orange-500 transition-all"
                        >
                          <PlusCircle size={24} />
                        </button>
                      )}
                    </div>
                  )}

                  {previews.length === 0 && (
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="border-2 border-dashed border-white/10 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 bg-white/[0.02] hover:bg-white/[0.05] hover:border-orange-500/30 transition-all cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Upload size={32} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-white mb-1">Click to upload images</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">JPG, PNG up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-[2] py-5 bg-orange-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-[0_10px_30px_rgba(249,115,22,0.3)] disabled:opacity-50"
                  >
                    {loading ? "Registering..." : "Complete Registration"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
