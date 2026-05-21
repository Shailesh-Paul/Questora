import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  ArrowRight,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
  Star,
  Upload,
  User,
  Loader2,
  Trash2,
} from "lucide-react";

export default function FooterCTA({ onPlan }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fileInputRef = useRef(null);

  const defaultTestimonials = [
    {
      _id: "default-1",
      name: "Aarav Sharma",
      role: "Adventure Enthusiast",
      comment: "My trip to Rishikesh was absolutely flawless! The itinerary curated by Questora was a perfect blend of adventure and peace.",
      rating: 5,
      photoUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      _id: "default-2",
      name: "Riya Sen",
      role: "Solo Traveler",
      comment: "I loved listing my beach villa in Goa! Questora connected me with amazing guests, and the payout process is super smooth.",
      rating: 5,
      photoUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      _id: "default-3",
      name: "Vikram Malhotra",
      role: "Luxury Explorer",
      comment: "The handpicked properties in Manali offered jaw-dropping views. The booking was seamless and customer support was outstanding.",
      rating: 5,
      photoUrl: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("/api/feedbacks");
      if (res.data && res.data.length > 0) {
        setFeedbacks(res.data);
      } else {
        setFeedbacks(defaultTestimonials);
      }
    } catch (error) {
      console.error("Failed to fetch feedbacks", error);
      setFeedbacks(defaultTestimonials);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(null);
    setPhotoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setSubmitError("Name and experience fields are required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("role", role || "Traveler");
      formData.append("comment", comment);
      formData.append("rating", rating);
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const res = await axios.post("/api/feedbacks", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201 || res.status === 200) {
        setSubmitSuccess(true);
        // Prepend the new feedback to the list dynamically
        setFeedbacks((prev) => [res.data, ...prev]);
        
        // Reset form fields
        setName("");
        setRole("");
        setComment("");
        setRating(5);
        setPhotoFile(null);
        setPhotoPreview("");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitError(
        error.response?.data?.error || 
        (photoFile 
          ? "Failed to upload image and submit testimonial. Please try again." 
          : "Failed to submit testimonial. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative overflow-hidden text-white">

      {/* 4K TOURISM BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Luxury tourism background"
          className="
            w-full
            h-full
            object-cover
            scale-105
          "
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-[#040712]/85" />

        {/* CINEMATIC OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#040712]/60 to-[#040712]" />
      </div>

      {/* AMBIENT GLOW */}
      <div className="absolute top-0 left-0 w-[35rem] h-[35rem] bg-orange-500/10 blur-[160px]" />

      <div className="absolute bottom-0 right-0 w-[35rem] h-[35rem] bg-cyan-500/10 blur-[170px]" />

      {/* MAIN CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-6">

        {/* TOP CTA SECTION */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            border border-white/10
            bg-black/30
            backdrop-blur-3xl
            px-8 md:px-16
            py-16
            mt-20
            shadow-[0_20px_100px_rgba(0,0,0,0.45)]
          "
        >
          {/* GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-cyan-500/10" />

          <div
            className="
              relative z-10
              flex
              flex-col
              lg:flex-row
              items-start
              lg:items-center
              justify-between
              gap-10
            "
          >
            {/* LEFT SIDE */}
            <div className="max-w-2xl">

              {/* LABEL */}
              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-4 py-2
                  rounded-full
                  border border-white/10
                  bg-white/[0.05]
                  backdrop-blur-xl
                  text-[10px]
                  uppercase
                  tracking-[0.3em]
                  text-white/50
                  font-semibold
                  mb-6
                "
              >
                Premium Weekend Experiences
              </span>

              {/* TITLE */}
              <h2
                className="
                  text-4xl
                  md:text-6xl
                  font-black
                  leading-[1]
                  tracking-tight
                  text-[#f3eee8]
                  mb-6
                "
              >
                Discover Your
                <br />
                Next Escape.
              </h2>

              {/* DESC */}
              <p
                className="
                  text-[15px]
                  md:text-lg
                  leading-relaxed
                  text-[#d2cbc2]
                  max-w-xl
                "
              >
                Curated destinations, authentic local stays,
                hidden experiences, and unforgettable journeys
                designed for modern travelers.
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col gap-4 w-full lg:w-auto">

              {/* BUTTON */}
              <button
                onClick={onPlan}
                className="
                  group
                  relative
                  overflow-hidden
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  h-[58px]
                  px-8
                  rounded-2xl
                  bg-white
                  text-slate-900
                  font-semibold
                  text-[15px]
                  shadow-[0_20px_60px_rgba(255,255,255,0.12)]
                  transition-all duration-500
                  hover:scale-[1.03]
                  hover:bg-orange-500
                  hover:text-white
                "
              >
                {/* HOVER EFFECT */}
                <div
                  className="
                    absolute inset-0
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity duration-500
                    bg-gradient-to-r
                    from-orange-500
                    to-amber-400
                  "
                />

                <span className="relative z-10">
                  Explore Destinations
                </span>

                <ArrowRight
                  size={18}
                  className="
                    relative z-10
                    transition-transform
                    group-hover:translate-x-1
                  "
                />
              </button>

              {/* NEWSLETTER */}
              <div
                className="
                  flex items-center
                  h-[58px]
                  rounded-2xl
                  bg-white/[0.05]
                  border border-white/10
                  overflow-hidden
                  backdrop-blur-xl
                "
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="
                    bg-transparent
                    px-5
                    w-full
                    outline-none
                    text-sm
                    text-white
                    placeholder:text-white/30
                  "
                />

                <button
                  className="
                    h-full
                    px-5
                    border-l border-white/10
                    text-orange-300
                    hover:bg-orange-500
                    hover:text-white
                    transition-all
                  "
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TESTIMONIALS & FEEDBACK SECTION */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start relative z-10">
          
          {/* TESTIMONIALS LIST (Takes 2 columns) */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <span className="text-orange-400 text-xs font-bold tracking-widest uppercase bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">
                Adventure Stories
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-white mt-4 tracking-tight leading-none">
                What Our Adventurers Say
              </h3>
              <p className="text-[#d2cbc2] text-sm md:text-base mt-3 max-w-xl leading-relaxed">
                Real stories and visual reviews from travelers who listed properties, embarked on journeys, or discovered hidden spots in India.
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/5 rounded-[2rem] backdrop-blur-md">
                <Loader2 className="animate-spin text-orange-400 w-10 h-10 mb-4" />
                <span className="text-white/60 text-sm">Gathering traveler feedback...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar">
                {feedbacks.map((item, idx) => (
                  <div 
                    key={item._id || idx} 
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 shadow-xl transition-all duration-500 hover:scale-[1.02] hover:border-orange-500/30 hover:bg-black/60 flex flex-col justify-between"
                  >
                    {/* ACCENT NEON GLOW */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent blur-3xl group-hover:from-orange-500/20 transition-all duration-500" />
                    
                    <div>
                      {/* RATING */}
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={`${i < item.rating ? 'fill-orange-400 text-orange-400' : 'text-white/20'}`} 
                          />
                        ))}
                      </div>

                      {/* COMMENT */}
                      <p className="text-[#d2cbc2] text-sm leading-relaxed mb-6 italic font-medium">
                        "{item.comment}"
                      </p>
                    </div>

                    {/* USER PROFILE */}
                    <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                      {item.photoUrl ? (
                        <img 
                          src={item.photoUrl} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-white/10 shadow-md group-hover:border-orange-400/50 transition-all duration-300"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                          <User size={18} className="text-orange-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-white font-bold text-sm tracking-tight">{item.name}</h4>
                        <span className="text-white/40 text-xs">{item.role || 'Traveler'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TESTIMONIAL SUBMISSION FORM (Takes 1 column) */}
          <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            {/* TOP GLOWING GRADIENT ACCENT */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-amber-400 to-cyan-500" />
            
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Share Your Experience</h3>
            <p className="text-white/50 text-xs mb-6">Contribute your travel testimonial and photo (optional) to our review wall.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* RATING SELECTION */}
              <div>
                <label className="block text-white/60 text-[10px] font-bold uppercase tracking-wider mb-2">Select Star Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform duration-200 hover:scale-125 focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={`${
                          star <= (hoveredRating || rating)
                            ? "fill-orange-400 text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]"
                            : "text-white/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* NAME */}
              <div>
                <label htmlFor="feedback-name" className="block text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  id="feedback-name"
                  type="text"
                  required
                  placeholder="e.g., Rohan Mehra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all duration-300 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 placeholder:text-white/20"
                />
              </div>

              {/* ROLE */}
              <div>
                <label htmlFor="feedback-role" className="block text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1.5">Who are you? (Role)</label>
                <input
                  id="feedback-role"
                  type="text"
                  placeholder="e.g., Backpacker / Villa Host (optional)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all duration-300 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 placeholder:text-white/20"
                />
              </div>

              {/* COMMENT */}
              <div>
                <label htmlFor="feedback-comment" className="block text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1.5">Your Story</label>
                <textarea
                  id="feedback-comment"
                  required
                  rows="3"
                  placeholder="Tell us about the incredible journey, stays or activities you loved..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all duration-300 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 placeholder:text-white/20 resize-none"
                />
              </div>

              {/* DYNAMIC IMAGE UPLOAD ZONE */}
              <div>
                <label className="block text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  Travel Selfie / Photo <span className="text-white/30 lowercase font-normal italic">(optional)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  id="feedback-photo-upload"
                />
                
                {photoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] p-2 flex items-center justify-between group/preview">
                    <div className="flex items-center gap-3">
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow-lg"
                      />
                      <div className="overflow-hidden max-w-[150px]">
                        <p className="text-white text-xs font-semibold truncate">{photoFile?.name}</p>
                        <p className="text-white/40 text-[10px]">{(photoFile?.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 mr-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border border-dashed border-white/15 hover:border-orange-500/40 hover:bg-white/[0.02] bg-white/[0.01] rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
                  >
                    <Upload size={20} className="text-white/30 group-hover:text-orange-400 transition-colors mb-2 group-hover:scale-110 duration-300" />
                    <p className="text-white/60 text-xs font-medium text-center">Drag & drop or <span className="text-orange-400 group-hover:underline font-semibold">browse</span></p>
                    <p className="text-white/30 text-[9px] mt-1">PNG, JPG or WEBP up to 5MB</p>
                  </div>
                )}
              </div>

              {/* ERRORS / SUCCESS TOASTS */}
              {submitError && (
                <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                  Thank you! Your testimonial has been shared successfully.
                </div>
              )}

              {/* SUBMIT BUTTON WITH LOADING STATES */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative overflow-hidden h-[50px] rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-[0_10px_30px_rgba(249,115,22,0.2)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>{photoFile ? "Uploading photo to Cloudinary..." : "Publishing Review..."}</span>
                  </>
                ) : (
                  <>
                    <span>Publish Review</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* FOOTER GRID */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-5
            gap-10
            py-20
          "
        >
          {/* BRAND */}
          <div className="lg:col-span-2">

            {/* LOGO */}
            <h3
              className="
                text-3xl
                font-black
                tracking-tight
                text-[#f3eee8]
                mb-5
              "
            >
              Quest<span className="text-orange-400">ora</span>
            </h3>

            {/* DESC */}
            <p
              className="
                text-[#d2cbc2]
                leading-relaxed
                max-w-md
                text-[15px]
              "
            >
              Questora helps modern travelers discover
              authentic local experiences, premium homestays,
              hidden destinations, and unforgettable
              weekend escapes.
            </p>

            {/* CONTACT */}
            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-3 text-white/50 text-sm">
                <Mail size={16} className="text-orange-300" />
                support@questora.com
              </div>

              <div className="flex items-center gap-3 text-white/50 text-sm">
                <Phone size={16} className="text-orange-300" />
                +91 98765 43210
              </div>

              <div className="flex items-center gap-3 text-white/50 text-sm">
                <MapPin size={16} className="text-orange-300" />
                Bhopal, India
              </div>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-white font-semibold mb-5">
              Company
            </h4>

            <div className="space-y-3 text-sm text-white/45">
              <a href="#" className="block hover:text-white transition-colors">
                About Us
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Careers
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Blog
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Press
              </a>
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <h4 className="text-white font-semibold mb-5">
              Explore
            </h4>

            <div className="space-y-3 text-sm text-white/45">
              <a href="#" className="block hover:text-white transition-colors">
                Destinations
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Homestays
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Rentals
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Local Guides
              </a>
            </div>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="text-white font-semibold mb-5">
              Legal
            </h4>

            <div className="space-y-3 text-sm text-white/45">
              <a href="#" className="block hover:text-white transition-colors">
                Privacy Policy
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Terms & Conditions
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Cookies
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          className="
            border-t border-white/10
            py-8
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-6
          "
        >
          {/* COPYRIGHT */}
          <p className="text-white/30 text-sm text-center md:text-left">
            © 2026 Questora. All rights reserved.
          </p>

          {/* SOCIALS */}
          <div className="flex items-center gap-3">
            {[
              <Instagram size={17} />,
              <Twitter size={17} />,
              <Facebook size={17} />,
              <Linkedin size={17} />,
            ].map((icon, i) => (
              <button
                key={i}
                className="
                  w-11 h-11
                  rounded-2xl
                  flex items-center justify-center
                  bg-white/[0.05]
                  border border-white/10
                  text-white/40
                  transition-all duration-300
                  hover:bg-orange-500
                  hover:text-white
                  hover:border-orange-400
                "
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}