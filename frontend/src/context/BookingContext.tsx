import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the booking context
interface Booking {
  service: ReactNode;
  id: string;
  name: string;
  date: string;
  price: number;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  removeBooking: (id: string) => void;
  clearBookings: () => void;

}

// Create context with default values
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Provider Component
export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Add a new booking
  const addBooking = (booking: Booking) => {
    setBookings((prev) => [...prev, booking]);
  };

  // Remove a booking by ID
  const removeBooking = (id: string) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id));
  };

  // Clear all bookings
  const clearBookings = () => {
    setBookings([]);
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, removeBooking, clearBookings }}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom Hook to use Booking Context
export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

// If you need a cart-specific hook
export const useCart = useBooking; // ✅ Fix for "useCart not exported" error

export default BookingContext;
