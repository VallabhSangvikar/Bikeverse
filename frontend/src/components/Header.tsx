import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext"; // Use correct context
import { Button } from "./ui/button";
import { Calendar } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const { bookings } = useBooking(); // Get bookings from context

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          BikeShop
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/products" className="hover:text-primary">
                Products
              </Link>
            </li>
            <li>
              <Link to="/posts" className="hover:text-primary">
                Posts
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link
                    to={user.role === "seller" ? "/seller" : "/dashboard"}
                    className="hover:text-primary"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Button onClick={logout} variant="ghost">
                    Logout
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-primary">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-primary">
                    Signup
                  </Link>
                </li>
              </>
            )}
            {/* Booking system instead of cart */}
            <li>
              <Link to="/bookings" className="relative flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-primary" />
                <span>Bookings ({bookings.length})</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
