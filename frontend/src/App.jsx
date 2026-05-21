import React, { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import StudentDashboard from "./pages/StudentDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PlanPage from "./pages/PlanPage";
import ItineraryPage from "./pages/ItineraryPage";
import RentalsPage from "./pages/RentalsPage";
import BookingPage from "./pages/BookingPage";
import ExperiencePlanner from "./pages/ExperiencePlanner";
import ExperienceCheckout from "./pages/ExperienceCheckout";
import AdminDashboard from "./pages/AdminDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";

// Components
import ScrollToTop from "./components/ScrollToTop";
import TravelAssistanceIcon from "./components/TravelAssistanceIcon";
import WhatsAppAI from "./components/WhatsAppAI";
import useTripStore from "./store/tripStore";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } },
});

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const ProviderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user || user.role !== 'verifiedProvider') return <Navigate to="/" replace />;
  return children;
};


function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
      if (followerRef.current) {
        setTimeout(() => {
          followerRef.current.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
        }, 80);
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}

export default function App() {
  const isPaid = useTripStore((state) => state.isPaid);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <div className="grain">
            <CustomCursor />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#1A1A1E",
                  color: "#F5F0E8",
                  border: "1px solid rgba(201,168,76,0.3)",
                  fontFamily: "'DM Sans', sans-serif",
                },
              }}
            />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <LandingPage />
                </ProtectedRoute>
              } />

              {/* Keep these for direct access if needed */}
              <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
              <Route path="/employee-dashboard" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />

              <Route path="/plan" element={<ProtectedRoute><PlanPage /></ProtectedRoute>} />

              <Route path="/itinerary/:destination" element={<ProtectedRoute><ItineraryPage /></ProtectedRoute>} />
              <Route path="/rentals" element={<ProtectedRoute><RentalsPage /></ProtectedRoute>} />
              <Route path="/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
              <Route path="/experiences" element={<ProtectedRoute><ExperiencePlanner /></ProtectedRoute>} />
              <Route path="/experience-checkout" element={<ProtectedRoute><ExperienceCheckout /></ProtectedRoute>} />
              
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/provider" element={<ProviderRoute><ProviderDashboard /></ProviderRoute>} />
            </Routes>



            {isPaid && <WhatsAppAI />}
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}
