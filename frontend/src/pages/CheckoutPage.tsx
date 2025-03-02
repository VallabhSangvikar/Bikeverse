import { useState } from "react";
import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { useToast } from "../hooks/use-toast";

const CheckoutPage = () => {
  const { bookings, removeBooking } = useBooking(); // Use removeBooking instead of clearBookings
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [bookingDetails, setBookingDetails] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  const total = bookings.reduce((sum, booking) => sum + booking.price, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Booking confirmed:", { bookings, bookingDetails, paymentMethod, total });

    // Remove all bookings one by one
    bookings.forEach((booking) => removeBooking(booking.id));

    toast({
      title: "Booking Confirmed!",
      description: "Your service has been booked successfully.",
    });

    // Redirect to a confirmation page if needed
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
        {/* Booking Details Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={bookingDetails.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={bookingDetails.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" value={bookingDetails.city} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={bookingDetails.postalCode}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={bookingDetails.country}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <h2 className="text-xl font-semibold mt-8 mb-4">Payment Method</h2>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit-card" id="credit-card" />
              <Label htmlFor="credit-card">Credit Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal">PayPal</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Order Summary Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex justify-between mb-2">
                <span>
                  {booking.service} ({booking.date})
                </span>
                <span>${booking.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full mt-6">
            Confirm Booking
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
