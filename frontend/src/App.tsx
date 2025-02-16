import { Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import ProductListingPage from "./pages/ProductListingPage"
import ProductDetailsPage from "./pages/ProductDetailsPage"
import BookingForm from "./pages/BookingForm"
import SellerDashboardPage from "./pages/SellerDashboardPage"
import BuyerDashboardPage from "./pages/BuyerDashboardPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import { Toaster } from "./components/ui/toaster"

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/book/:id" element={<BookingForm />} />
          <Route path="/bookings" element={<ProductListingPage />} /> 
          <Route path="/seller" element={<SellerDashboardPage />} />
          <Route path="/dashboard" element={<BuyerDashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

export default App
