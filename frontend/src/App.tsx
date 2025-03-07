import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import BookingForm from "./pages/BookingForm";
import BookPage from "./pages/BookPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage"; 
import SetupPage from "./pages/SetupPage";
import { Toaster } from "./components/ui/toaster";
import { useAuth } from "./context/AuthContext";
import BikeDetailsPage from "./pages/BikeDetailsPage";
import PostsPage from "./pages/PostsPage";
// Protected route component
const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
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
          <Route path="/home" element={<HomePage />} />
          <Route path="/bikes/:id" element={<BikeDetailsPage />} />
          
          <Route path="/book/:id" element={
            <ProtectedRoute>
              <BookingForm />
            </ProtectedRoute>
          } />
          
          <Route path="/bookings" element={
            // <ProtectedRoute>
              <BookPage />
            // </ProtectedRoute>
          } />
          
          
          <Route path="/seller" element={
            <ProtectedRoute>
              <SellerDashboardPage />
            </ProtectedRoute>
          } />
          
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/posts" element={<PostsPage />} /> {/* ✅ New Route */}
          
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
