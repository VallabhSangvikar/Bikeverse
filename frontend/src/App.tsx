import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import BookingForm from "./pages/BookingForm";
import BookingPage from "./pages/BookPage";  // New Page for Booking History/Details
import SellerDashboardPage from "./pages/SellerDashboardPage";
import BuyerDashboardPage from "./pages/BuyerDashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage"; 
import { Toaster } from "./components/ui/toaster";
import { BookingProvider } from "./context/BookingContext";  // Ensuring Context Wrapping

function App() {
  return (
    <Router>
      <BookingProvider>  {/* Ensuring Booking Context is Available */}
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductListingPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              
              <Route path="/book/:id" element={<BookingForm />} />  
              <Route path="/bookings" element={<BookingPage />} /> {/* Dedicated Booking Page */}
            
              <Route path="/seller" element={<SellerDashboardPage />} />
              <Route path="/dashboard" element={<BuyerDashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </BookingProvider>
    </Router>
  );
}

export default App;
