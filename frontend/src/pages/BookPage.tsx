import { Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { Button } from "../components/ui/button";
import { Trash2, Calendar } from "lucide-react";

const BookPage = () => {
  const { bookings, removeBooking } = useBooking();

  const total = bookings.reduce((sum, booking) => sum + booking.price, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">You have no bookings yet</p>
          <Link to="/services">
            <Button>Book a Service</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center border-b py-4">
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold">{booking.service}</h2>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{booking.date}</span>
                  </div>
                  <p className="text-gray-600 mt-1">${booking.price}</p>
                </div>
                <Button variant="ghost" onClick={() => removeBooking(booking.id)}>
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </div>
            ))}
          </div>

          <div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Total Cost</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Link to="/checkout">
                <Button className="w-full mt-6">Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookPage;
