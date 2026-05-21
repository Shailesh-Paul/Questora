import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTripStore from "../store/tripStore";
import toast from "react-hot-toast";
import { ArrowLeft, CreditCard, CheckCircle, ShieldCheck } from "lucide-react";
import { API_BASE_URL, WHATSAPP_ASSISTANT_URL } from "../config";
import WhatsAppScanner from "../components/WhatsAppScanner";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function BookingPage() {
  const navigate = useNavigate();
  const { cart, selectedHotel, members, destination, reset, dateRange, setPaid, sessionId, autoSaveTrip } = useTripStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [tempPhone, setTempPhone] = useState("");
  const [travelers, setTravelers] = useState([]);
  const [customRequirements, setCustomRequirements] = useState("");

  useEffect(() => {
    const num = Number(members) || 1;
    setTravelers(prev => {
      const arr = Array.from({ length: num }, (_, idx) => {
        return prev[idx] || { name: "", age: "", aadhar: "" };
      });
      return arr;
    });
  }, [members]);

  const handleTravelerChange = (idx, field, value) => {
    setTravelers(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const isFormValid = () => {
    if (travelers.length === 0) return false;
    return travelers.every(t => t.name.trim() !== "" && t.aadhar.trim() !== "");
  };

  const nights = dateRange.start && dateRange.end
    ? Math.max(1, Math.ceil((new Date(dateRange.end) - new Date(dateRange.start)) / (1000 * 60 * 60 * 24)))
    : 2;
  const totalActivitiesCost = cart.reduce((sum, i) => sum + i.price, 0);
  const totalHotelCost = selectedHotel ? selectedHotel.price * nights : 0;
  const advanceToPay = Math.round(totalActivitiesCost * 0.2);
  const remainingToPay = totalActivitiesCost - advanceToPay;
  const grandTotal = totalActivitiesCost + totalHotelCost;

  useEffect(() => {
    if (!destination) {
      navigate("/");
    }
  }, [destination, navigate]);

  const updatePaymentStatus = async (paymentId, orderId, status) => {
    try {
      await fetch(`${API_BASE_URL}/tripplans/payment-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          paymentStatus: status,
          paymentId,
          orderId
        })
      });
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Auto-save trip first
      await autoSaveTrip();

      // 1. Compile items for booking
      const bookingItems = [...cart];
      if (selectedHotel) {
        bookingItems.push({ ...selectedHotel, type: 'hotel' });
      }

      const userData = JSON.parse(localStorage.getItem("user"));

      // Get user's phone number
      let userPhone = userData?.phoneNumber || tempPhone;

      if (!userPhone) {
        setShowPhonePrompt(true);
        setIsProcessing(false);
        return;
      }

      // Ensure phone number has '+' prefix for Twilio WhatsApp
      if (!userPhone.startsWith("+")) {
        userPhone = "+" + userPhone;
      }

      // 2. Record booking in main backend database
      await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userData?.token}` 
        },
        body: JSON.stringify({
          items: bookingItems,
          destinationId: destination.id,
          startDate: dateRange.start || new Date().toISOString(),
          endDate: dateRange.end || new Date(Date.now() + 86400000 * 2).toISOString(),
          quantity: members,
          userPhoneNumber: userPhone,
          customerName: travelers[0]?.name || "",
          aadharNumber: travelers[0]?.aadhar || "",
          age: travelers[0]?.age ? Number(travelers[0].age) : undefined,
          customRequirements,
          travelers: travelers.map(t => ({
            name: t.name,
            age: t.age ? Number(t.age) : undefined,
            aadhar: t.aadhar
          }))
        })
      });

      // 3. Initialize WhatsApp Assistant (Sends actual WhatsApp message immediately)
      let tripData = null;
      try {
        const response = await fetch(`${WHATSAPP_ASSISTANT_URL}/api/v1/trips/initialize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_name: userData?.name || userData?.phoneNumber || 'Traveler',
            phone_number: userPhone,
            destination: destination.name,
            check_in_date: dateRange.start || new Date().toISOString(),
            check_out_date: dateRange.end || new Date(Date.now() + 86400000 * 2).toISOString(),
            hotel: selectedHotel ? {
              name: selectedHotel.name,
              lat: selectedHotel.lat || 31.5,
              lng: selectedHotel.lng || 77.1
            } : null,
            budget_total: grandTotal,
            activities: cart,
            total_activities_cost: totalActivitiesCost,
            total_hotel_cost: totalHotelCost,
            advance_paid: advanceToPay,
            remaining_amount: remainingToPay,
            grand_total: grandTotal,
            members: members
          })
        });

        const data = await response.json();
        if (data.success) {
          console.log('WhatsApp assistant initialized!');
          tripData = data.data;
          toast.success('WhatsApp message sent! Check your WhatsApp.');
        }
      } catch (wsErr) {
        console.error("WhatsApp Assistant Init Error:", wsErr);
      }

      // 4. Activate subscription for WhatsApp AI access
      try {
        const paymentId = 'payment_' + Date.now();
        const orderId = 'order_' + Date.now();

        await fetch(`${WHATSAPP_ASSISTANT_URL}/api/v1/trips/activate-subscription`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone_number: userPhone,
            plan: 'TRIP_PACKAGE',
            plan_name: 'Trip Package',
            amount_paid: advanceToPay,
            payment_id: paymentId,
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            trip_id: tripData?.trip_id,
            destination: destination.name,
            check_in_date: dateRange.start || new Date().toISOString(),
            check_out_date: dateRange.end || new Date(Date.now() + 86400000 * 2).toISOString(),
            duration_days: nights + 1
          })
        });
        console.log('Subscription activated!');
      } catch (subErr) {
        console.error("Subscription Activation Error:", subErr);
      }

      // 4. Simulate payment success for demo (in production, use Razorpay)
      setTimeout(() => {
        setPaid(true);
        setIsSuccess(true);
        updatePaymentStatus('payment_' + Date.now(), 'order_' + Date.now(), 'completed');
        toast.success("Payment Successful! Confirmation sent to WhatsApp.");
      }, 1500);

    } catch (error) {
      console.error("Payment Process Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-body">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 max-w-2xl w-full border border-slate-100 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />

          {/* WhatsApp Scanner Section */}
          <WhatsAppScanner />

          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle size={44} />
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-900 mb-2">Booking Confirmed!</h1>
            <p className="text-slate-500">Receipt ID: #QST-{Math.floor(100000 + Math.random() * 900000)}</p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 md:p-8 mb-8 border border-slate-100">
            <h2 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-6">Order Summary</h2>

            <div className="space-y-6">
              {/* Destination & Hotel */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg text-slate-900">{destination?.name}</p>
                  <p className="text-sm text-slate-500">{selectedHotel?.name || 'Standard Stay'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">₹{(selectedHotel?.price * nights || 0).toLocaleString("en-IN")}</p>
                  <p className="text-xs text-slate-400">{nights} Nights</p>
                </div>
              </div>

              {/* Activities */}
              {cart.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Activities</p>
                  <div className="space-y-3">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-slate-600 font-medium">• {item.name}</span>
                        <span className="text-slate-900 font-bold">₹{item.price.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Summary Split */}
              <div className="pt-6 border-t border-slate-300 space-y-4">
                <div className="flex justify-between items-center text-slate-500 text-sm">
                  <p>Grand Total (Itinerary Value)</p>
                  <p>₹{grandTotal.toLocaleString("en-IN")}</p>
                </div>
                
                {selectedHotel && (
                  <div className="flex justify-between items-center text-slate-500 text-sm">
                    <p>Hotel Stay</p>
                    <p>Booked Separately</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                  <p className="font-display font-bold text-xl text-slate-900">Amount Paid (20% Advance)</p>
                  <p className="font-display font-bold text-3xl text-orange-500">₹{advanceToPay.toLocaleString("en-IN")}</p>
                </div>
                
                <div className="flex justify-between items-center px-4">
                  <p className="font-bold text-sm text-slate-600">Remaining Amount</p>
                  <p className="font-bold text-sm text-slate-900">₹{remainingToPay.toLocaleString("en-IN")}</p>
                </div>
                <p className="text-xs text-center text-slate-400 mt-2">*Remaining amount is to be paid directly to the local guides/vendors at the destination.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                window.print();
                toast.success("Downloading receipt...");
              }}
              className="flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            >
              <ShieldCheck size={20} className="text-emerald-500" />
              Download Receipt
            </button>
            <button
              onClick={() => {
                reset();
                navigate("/");
              }}
              className="flex items-center justify-center gap-3 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-orange-500 transition-all active:scale-95 shadow-lg"
            >
              Back to Home
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            A copy of this receipt has been sent to your registered WhatsApp number.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-body text-slate-900 pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors font-bold text-sm uppercase tracking-wider">
          <ArrowLeft size={16} /> Back to Itinerary
        </button>

        <div className="mb-10 text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-3">Secure Checkout</h1>
          <p className="text-slate-500 font-medium">Complete your payment to confirm your trip to {destination?.name}.</p>
        </div>

        {/* WhatsApp Phone Prompt Modal */}
        {showPhonePrompt && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-md w-full border border-slate-100">
              <h3 className="font-display font-bold text-2xl mb-2 text-slate-900">WhatsApp Details</h3>
              <p className="text-slate-500 text-sm mb-6">We need your WhatsApp number to send your booking receipt and activate your AI travel assistant.</p>
              <div className="space-y-4">
                <input 
                  type="tel" 
                  placeholder="+91 9876543210" 
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none font-medium"
                />
                <div className="flex gap-3">
                  <button onClick={() => setShowPhonePrompt(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                  <button 
                    onClick={() => {
                      if(tempPhone.length < 10) {
                        toast.error("Please enter a valid phone number");
                        return;
                      }
                      setShowPhonePrompt(false);
                      handlePayment();
                    }} 
                    className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Order Summary & Customer Details */}
          <div className="md:col-span-3 space-y-6">
            
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8">
              <h2 className="font-display font-bold text-2xl mb-6">Customer Details</h2>
              <div className="space-y-6">
                {travelers.map((traveler, idx) => (
                  <div key={idx} className="pb-6 border-b border-slate-100 last:border-b-0 last:pb-0">
                    <p className="font-display font-bold text-sm text-orange-500 uppercase tracking-wider mb-4">
                      {idx === 0 ? "Traveler 1 (Primary Contact)" : `Traveler ${idx + 1}`}
                    </p>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Full Name</label>
                          <input 
                            type="text" 
                            value={traveler.name || ""} 
                            onChange={e => handleTravelerChange(idx, "name", e.target.value)} 
                            placeholder="John Doe" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-medium text-slate-800" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Age</label>
                          <input 
                            type="number" 
                            value={traveler.age || ""} 
                            onChange={e => handleTravelerChange(idx, "age", e.target.value)} 
                            placeholder="25" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-medium text-slate-800" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Aadhar Card Number</label>
                        <input 
                          type="text" 
                          value={traveler.aadhar || ""} 
                          onChange={e => handleTravelerChange(idx, "aadhar", e.target.value)} 
                          placeholder="1234 5678 9012" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-medium text-slate-800" 
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Custom Requirements / Notes</label>
                  <textarea value={customRequirements} onChange={e => setCustomRequirements(e.target.value)} placeholder="Any specific dietary or accessibility needs?" rows="2" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-medium text-slate-800"></textarea>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8">
              <h2 className="font-display font-bold text-2xl mb-6">Order Summary</h2>

              {selectedHotel && (
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Hotel Stay</p>
                    <p className="text-xs font-bold bg-blue-50 text-blue-500 px-2 py-1 rounded">Excluded from Activity Checkout</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src={selectedHotel.image} alt={selectedHotel.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{selectedHotel.name}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-widest">{nights} nights stay</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{totalHotelCost.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.open(selectedHotel.externalBookingLink || selectedHotel.externalBookingUrl || 'https://www.makemytrip.com', '_blank')}
                    className="mt-4 w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors text-sm"
                  >
                    Book Hotel via External Site ↗
                  </button>
                </div>
              )}

              {cart.length > 0 && (
                <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Activities ({cart.length})</p>
                  {cart.map((act) => (
                    <div key={act.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 text-sm">{act.name}</p>
                        <p className="text-xs text-slate-500">{members} members</p>
                      </div>
                      <p className="font-bold text-sm text-slate-600">₹{act.price.toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between text-slate-500">
                  <p className="font-bold">Total Activities</p>
                  <p className="font-bold">₹{totalActivitiesCost.toLocaleString("en-IN")}</p>
                </div>
                <div className="flex items-center justify-between bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <div>
                    <p className="font-bold text-lg text-slate-900">20% Advance</p>
                    <p className="text-xs text-slate-500 mt-1">Remaining ₹{remainingToPay.toLocaleString("en-IN")} due at destination</p>
                  </div>
                  <p className="font-display font-bold text-3xl text-orange-500">₹{advanceToPay.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="md:col-span-2">
            <div className="bg-slate-900 text-white rounded-[2rem] shadow-xl p-8 sticky top-24">
              <div className="flex items-center gap-3 mb-8">
                <ShieldCheck className="text-emerald-400" size={28} />
                <p className="font-bold">100% Secure Payment</p>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-slate-400 text-sm">You will be redirected to Razorpay's secure checkout page to complete this transaction.</p>
                <div className="flex gap-2">
                  <div className="bg-white/10 px-3 py-1.5 rounded text-xs font-bold text-white/70">UPI</div>
                  <div className="bg-white/10 px-3 py-1.5 rounded text-xs font-bold text-white/70">Cards</div>
                  <div className="bg-white/10 px-3 py-1.5 rounded text-xs font-bold text-white/70">NetBanking</div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing || totalActivitiesCost === 0 || !isFormValid()}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold tracking-wider text-sm uppercase py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-3"
              >
                {isProcessing ? "Processing..." : (
                  <>
                    <CreditCard size={18} /> Pay 20% Advance: ₹{advanceToPay.toLocaleString("en-IN")}
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}