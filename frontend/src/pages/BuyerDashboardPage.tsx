// BuyerDashboardPage.tsx
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { fetchBuyerBookings, fetchBuyerSavedBookings } from "../services/buyerService";

// Define types for bookings and saved bookings
interface Booking {
  id: string;
  date: string;
  serviceName: string;
  status: string;
}

interface SavedBooking {
  id: string;
  name: string;
  price: number;
  image?: string;
}

function BuyerDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedBookings, setSavedBookings] = useState<SavedBooking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBuyerData = async () => {
      try {
        const fetchedBookings = await fetchBuyerBookings();
        const fetchedSavedBookings = await fetchBuyerSavedBookings();

        // Ensure data safety
        setBookings(Array.isArray(fetchedBookings) ? fetchedBookings : []);
        setSavedBookings(Array.isArray(fetchedSavedBookings) ? fetchedSavedBookings : []);
      } catch (err) {
        console.error("Error fetching buyer data:", err);
        setError("Failed to load data. Please try again.");
      }
    };

    loadBuyerData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Buyer Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}

      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Booking History</TabsTrigger>
          <TabsTrigger value="savedBookings">Saved Bookings</TabsTrigger>
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
        </TabsList>

        {/* Booking History */}
        <TabsContent value="bookings">
          <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Booking #{booking.id}</h3>
                  <span className="text-gray-600">{booking.date}</span>
                </div>
                <p className="text-gray-600 mb-2">Service: {booking.serviceName}</p>
                <p className="text-gray-600 mb-2">Status: {booking.status}</p>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Saved Bookings */}
        <TabsContent value="savedBookings">
          <h2 className="text-2xl font-semibold mb-4">Saved Bookings</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {savedBookings.map((booking) => (
              <div key={booking.id} className="border p-4 rounded-lg">
                <img
                  src={booking.image || "/placeholder.svg"}
                  alt={booking.name}
                  className="w-full h-48 object-cover mb-4 rounded" />
                <h3 className="text-lg font-semibold">{booking.name}</h3>
                <p className="text-gray-600 mb-2">Price: ₹{booking.price}</p>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">Book Now</Button>
                  <Button variant="destructive" size="sm">Remove</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
              <input type="password" id="password" name="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default BuyerDashboardPage;
