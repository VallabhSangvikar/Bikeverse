import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
// Define the shape of the booking context
interface Booking {
  id: string;
  name: string;
  service: any;
  date: string;
  price: number;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  removeBooking: (id: string) => void;
  clearBookings: () => void;
  getBookings:()=>void;
}

// Create context with default values
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Provider Component
export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Add a new booking
  const addBooking =async (bookingData: Booking) => {
    try {
      const respo=await axios.post('http://localhost:3000/api/bookings', bookingData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBookings((prev) => [...prev, respo.data]);
      return respo.data;

    } catch (error) {
      throw new Error('Error creating booking');
    }
  };

  const getBookings = async () => {
    try {
      const respo=await axios.get('http://localhost:3000/api/bookings/my-bookings', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return respo.data;
    } catch (error) {
      throw new Error('Error getting bookings');
    }
  }

  // Remove a booking by ID
  const removeBooking = (id: string) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id));
  };

  // Clear all bookings
  const clearBookings = () => {
    setBookings([]);
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, removeBooking, clearBookings,getBookings }}>
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

export default BookingContext;
