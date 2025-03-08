import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { Button } from "./ui/button";
import { Calendar } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const { bookings } = useBooking();

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            BikeShop
          </Link>
          
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6">
              <li>
                <Link to="/home" className="text-muted-foreground hover:text-primary transition-colors">
                  Bikes
                </Link>
              </li>
              <li>
                <Link to="/posts" className="text-muted-foreground hover:text-primary transition-colors">
                  Posts
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Button onClick={logout} variant="secondary">
                      Logout
                    </Button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Button variant="ghost" asChild>
                      <Link to="/login">Login</Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="default" asChild>
                      <Link to="/signup">Signup</Link>
                    </Button>
                  </li>
                </>
              )}
              <li>
                <Link 
                  to="/bookings" 
                  className="relative flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-secondary"
                >
                  <Calendar className="w-5 h-5" />
                  {bookings.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {bookings.length}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
