import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTripStore from "../store/tripStore";
import toast from "react-hot-toast";
import { ArrowLeft, CreditCard, CheckCircle, ShieldCheck } from "lucide-react";

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
  const { cart, selectedHotel, members, destination, reset, dateRange } = useTripStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const nights = dateRange.start && dateRange.end 
    ? Math.max(1, Math.ceil((new Date(dateRange.end) - new Date(dateRange.start)) / (1000 * 60 * 60 * 24))) 
    : 2;
  const totalCost = cart.reduce((sum, i) => sum + i.price, 0) + (selectedHotel ? selectedHotel.price * nights : 0);

  useEffect(() => {
    if (!destination) {
      navigate("/");
    }
  }, [destination, navigate]);

  const handlePayment = async () => {
    setIsProcessing(true);
    const res = await loadRazorpayScript();

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    try {
      // Create order from backend
      const orderResponse = await fetch("http://localhost:5000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalCost }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await orderResponse.json();

      const options = {
        key: "rzp_test_SnQQo0BjlwDtYq",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Questora Travels",
        description: `Trip to ${destination?.name}`,
        image: destination?.image || "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=200",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // Compile items for booking
            const bookingItems = [...cart];
            if (selectedHotel) {
              bookingItems.push({ ...selectedHotel, type: 'hotel' });
            }

            // Record booking in backend
            await fetch("http://localhost:5000/api/bookings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: bookingItems,
                destinationId: destination.id,
                startDate: dateRange.start || new Date().toISOString(),
                endDate: dateRange.end || new Date(Date.now() + 86400000 * 2).toISOString(),
                quantity: members
              })
            });
            
            toast.success("Payment Successful!");
            setIsSuccess(true);
          } catch (e) {
            console.error("Failed to record booking:", e);
            toast.success("Payment Successful! (Booking record failed)");
            setIsSuccess(true);
          }
        },
        prefill: {
          name: "Traveler",
          email: "traveler@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#f97316",
        },
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on("payment.failed", function (response) {
        toast.error("Payment failed. Please try again.");
      });

      paymentObject.open();
    } catch (error) {
      toast.error("Something went wrong with the payment gateway.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-body">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h1 className="font-display font-bold text-3xl text-slate-900 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-600 mb-8">
            Your trip to <span className="font-bold">{destination?.name}</span> is successfully booked. We have sent the itinerary and tickets to your email.
          </p>
          <button
            onClick={() => {
              reset();
              navigate("/");
            }}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-orange-500 transition-colors"
          >
            Plan Another Trip
          </button>
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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8">
              <h2 className="font-display font-bold text-2xl mb-6">Order Summary</h2>
              
              {selectedHotel && (
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <img src={selectedHotel.image} alt={selectedHotel.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{selectedHotel.name}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">{nights} nights stay</p>
                  </div>
                  <p className="font-bold text-lg">₹{(selectedHotel.price * nights).toLocaleString("en-IN")}</p>
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

              <div className="flex items-center justify-between pt-2">
                <p className="font-bold text-xl text-slate-900">Total Amount</p>
                <p className="font-display font-bold text-3xl text-orange-500">₹{totalCost.toLocaleString("en-IN")}</p>
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
                disabled={isProcessing || totalCost === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold tracking-wider text-sm uppercase py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-3"
              >
                {isProcessing ? "Processing..." : (
                  <>
                    <CreditCard size={18} /> Pay ₹{totalCost.toLocaleString("en-IN")}
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
