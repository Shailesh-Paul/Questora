import React from "react";
import { MapPin, Coffee, Bike, Tent } from "lucide-react";

export default function Features() {
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
