import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Define the type for booking details
interface BookingDetails {
  name: string;
  date: string;
  duration: number;
}

const BookingForm = () => {
  const { id } = useParams<{ id: string }>(); // Get bike ID from URL
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    name: "",
    date: "",
    duration: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/bookings", {
        bikeId: id,
        ...bookingDetails,
      });
      alert("Bike booked successfully!");
    } catch (error) {
      console.error("Error booking bike:", error);
      alert("Failed to book the bike. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Book Your Bike</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block font-medium">Name:</label>
          <input
            type="text"
            value={bookingDetails.name}
            onChange={(e) =>
              setBookingDetails({ ...bookingDetails, name: e.target.value })
            }
            required
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Date Input */}
        <div>
          <label className="block font-medium">Date:</label>
          <input
            type="date"
            value={bookingDetails.date}
            onChange={(e) =>
              setBookingDetails({ ...bookingDetails, date: e.target.value })
            }
            required
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Duration Input */}
        <div>
          <label className="block font-medium">Duration (Days):</label>
          <input
            type="number"
            min="1"
            value={bookingDetails.duration}
            onChange={(e) =>
              setBookingDetails({
                ...bookingDetails,
                duration: parseInt(e.target.value) || 1, // Ensure it's a number
              })
            }
            required
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
