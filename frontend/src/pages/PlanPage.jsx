import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTripStore from "../store/tripStore";
import { fetchWeather } from "../lib/api";
import { ArrowLeft, MapPin, Phone, MessageCircle, Star, Filter, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const MOCK_LISTINGS = {
  Stay: [
    { id: "s1", title: "Ramesh's Pine Homestay", owner: "Ramesh", type: "Homestay", price: "₹1,500", weekendPrice: "₹2,000", rating: 4.8, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600", tags: ["Local Host", "Weekend Deal"] },
    { id: "s2", title: "Valley View Cottage", owner: "Priya", type: "Entire Cottage", price: "₹3,000", weekendPrice: "₹3,500", rating: 4.9, img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600", tags: ["Pet Friendly"] },
  ],
  Transport: [
    { id: "t1", title: "Royal Enfield Classic 350", owner: "Singh Rentals", type: "Bike", price: "₹800/day", weekendPrice: "₹1,500/weekend", rating: 4.7, img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600", tags: ["Weekend Package"] },
    { id: "t2", title: "Honda Activa 6G", owner: "Amit", type: "Scooter", price: "₹400/day", weekendPrice: "₹700/weekend", rating: 4.5, img: "https://images.unsplash.com/photo-1568644396922-5c3bfae12521?w=600", tags: [] },
  ],
  Activities: [
    { id: "a1", title: "Hidden Waterfall Trek", owner: "Vikram (Local Guide)", type: "Trek", price: "₹500/person", weekendPrice: "₹500/person", rating: 4.9, img: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600", tags: ["Local Guide"] },
    { id: "a2", title: "White Water Rafting", owner: "Himalayan Adventures", type: "Adventure", price: "₹1,200/person", weekendPrice: "₹1,200/person", rating: 4.8, img: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=600", tags: [] },
  ],
  Food: [
    { id: "f1", title: "Aunty's Himachali Kitchen", owner: "Sunita Devi", type: "Home Kitchen", price: "₹350/thali", weekendPrice: "₹350/thali", rating: 5.0, img: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600", tags: ["Authentic", "Home Cooked"] },
    { id: "f2", title: "Riverside Cafe", owner: "Rahul", type: "Cafe", price: "Avg ₹500", weekendPrice: "Avg ₹500", rating: 4.6, img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600", tags: ["Live Music (Sat)"] },
  ]
};

export default function PlanPage() {
  const navigate = useNavigate();
  const { destination, dateRange, setDateRange } = useTripStore();
  const [activeTab, setActiveTab] = useState("Stay");
  const [weather, setWeather] = useState(null);
  const [enquiryModal, setEnquiryModal] = useState(null);

  useEffect(() => {
    if (!destination) {
      navigate("/");
      return;
    }
    fetchWeather(destination.name).then(setWeather);

    // Set default dates to upcoming Friday-Sunday if not set
    if (!dateRange.start || !dateRange.end) {
      const d = new Date();
      const diff = (5 - d.getDay() + 7) % 7 || 7;
      const start = new Date(d);
      start.setDate(d.getDate() + diff);
      const end = new Date(start);
      end.setDate(start.getDate() + 2);
      setDateRange({ start, end });
    }
  }, [destination, navigate, dateRange, setDateRange]);

  if (!destination) return null;

  const tabs = ["Stay", "Transport", "Activities", "Food"];

  const handleEnquire = (item) => {
    setEnquiryModal(item);
  };

  const submitEnquiry = (e) => {
    e.preventDefault();
    toast.success("Enquiry sent directly to owner! They will contact you shortly.");
    setEnquiryModal(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-body text-slate-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back to Search
        </button>
        <div className="font-display font-bold text-xl text-slate-900">
          Weekend<span className="text-orange-500">Wander</span>
        </div>
        <div className="w-24"></div> {/* spacer */}
      </div>

      {/* Destination Hero */}
      <div className="bg-slate-900 text-white relative">
        <div className="absolute inset-0 opacity-40">
          <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-orange-400 font-semibold tracking-wider uppercase text-xs mb-2 block">{destination.state}</span>
              <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">{destination.name}</h1>
              <p className="text-slate-300 text-lg">{destination.tagline}</p>
            </div>
            
            {weather && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold">{weather.temp}°C</div>
                <div className="text-sm text-slate-300 capitalize">{weather.description}</div>
              </div>
            )}
          </div>

          {/* Weekend Dates Selector */}
          <div className="mt-8 bg-white rounded-xl p-4 flex flex-wrap items-center gap-4 text-slate-900 max-w-2xl shadow-lg">
            <div className="flex items-center gap-2 text-blue-600">
              <Calendar size={20} />
              <span className="font-bold">Weekend Trip</span>
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
            <div className="flex gap-4 flex-1">
              <DatePicker
                selected={dateRange.start}
                onChange={(d) => setDateRange({ ...dateRange, start: d })}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-blue-500"
                placeholderText="Friday Check-in"
              />
              <DatePicker
                selected={dateRange.end}
                onChange={(d) => setDateRange({ ...dateRange, end: d })}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-blue-500"
                placeholderText="Sunday Check-out"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        {/* Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 border-b border-slate-200 pb-px">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold text-sm transition-all whitespace-nowrap border-b-2 ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-8">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium hover:border-blue-500 transition-colors shadow-sm">
            <Filter size={16} /> Filters
          </button>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">Weekend Special Rates Applied</span>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_LISTINGS[activeTab].map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {item.tags.map(t => (
                    <span key={t} className="px-2 py-1 bg-white/90 backdrop-blur text-xs font-bold text-slate-800 rounded-md shadow-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900 leading-tight">{item.title}</h3>
                  <div className="flex items-center gap-1 text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" /> {item.rating}
                  </div>
                </div>
                <div className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                  <MapPin size={14} /> Hosted by {item.owner} • {item.type}
                </div>
                
                <div className="bg-blue-50/50 rounded-lg p-3 mb-5 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">Standard Rate</span>
                    <span className="text-sm text-slate-400 line-through">{item.price}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs font-bold text-orange-600">Weekend Special</span>
                    <span className="text-lg font-bold text-slate-900">{item.weekendPrice}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleEnquire(item)}
                    className="flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-2.5 rounded-xl hover:bg-slate-800 transition-colors text-sm"
                  >
                    <MessageCircle size={16} /> Enquire
                  </button>
                  <button
                    onClick={() => toast("Direct calling feature simulated.", { icon: "📞" })}
                    className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-2.5 rounded-xl hover:bg-green-600 transition-colors text-sm"
                  >
                    <Phone size={16} /> Call Owner
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enquiry Modal */}
      {enquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-on-load">
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold">Contact {enquiryModal.owner}</h3>
              <button onClick={() => setEnquiryModal(null)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={submitEnquiry} className="p-6">
              <div className="mb-4">
                <p className="font-bold text-slate-900">{enquiryModal.title}</p>
                <p className="text-sm text-slate-500">Dates: {dateRange.start?.toLocaleDateString()} - {dateRange.end?.toLocaleDateString()}</p>
              </div>
              <input type="text" placeholder="Your Name" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 outline-none focus:border-blue-500" />
              <input type="tel" placeholder="Phone Number / WhatsApp" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 outline-none focus:border-blue-500" />
              <textarea placeholder="Special requests or questions?" rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl mb-6 outline-none focus:border-blue-500"></textarea>
              <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-lg">
                Send Enquiry (No Payment Required)
              </button>
              <p className="text-xs text-center text-slate-400 mt-4">Platform does not charge any commission. Pay directly to the owner.</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
