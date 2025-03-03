import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import BookingForm from "./pages/BookingForm";
import BookingPage from "./pages/BookPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import BuyerDashboardPage from "./pages/BuyerDashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage"; 
import SetupPage from "./pages/SetupPage";
import { Toaster } from "./components/ui/toaster";
import { useAuth } from "./context/AuthContext";
import ServicesPage from "./pages/ServicesPage";  

// Protected route component
const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // If user hasn't completed setup, redirect to setup
  if (!user.setup) {
    return <Navigate to="/setup" replace />;
  }
  
  return children;
};

// Setup route component
const SetupRoute = ({ children, redirectTo = "/login" }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // If user has already completed setup, redirect to appropriate dashboard
  if (user.setup) {
    return <Navigate to={user.role === "seller" ? "/seller" : "/dashboard"} replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          
          <Route path="/book/:id" element={
            <ProtectedRoute>
              <BookingForm />
            </ProtectedRoute>
          } />
          
          <Route path="/bookings" element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          } />
          
          <Route path="/services" element={<ServicesPage />} />
          
          <Route path="/seller" element={
            <ProtectedRoute>
              <SellerDashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <BuyerDashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route path="/setup" element={
            <SetupRoute>
              <SetupPage />
            </SetupRoute>
          } />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;