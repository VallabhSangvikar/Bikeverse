// Mock data for bookings
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";

// Sample buyer bookings
const buyerBookings = [
  { id: "1", date: "2023-05-01", serviceName: "Bike Servicing", status: "Completed" },
  { id: "2", date: "2023-05-15", serviceName: "Engine Repair", status: "Scheduled" },
  // Add more mock booking data...
];

// Sample saved bookings (wishlist equivalent)
const buyerSavedBookings = [
  { id: "1", name: "Premium Bike Service", price: 5000, image: image3 },
  { id: "2", name: "Electric Scooter Repair", price: 2500, image: image1 },
  // Add more saved booking options...
];

// Fetch Buyer Bookings
export const fetchBuyerBookings = async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return buyerBookings;
};

// Fetch Buyer Saved Bookings (Wishlist Alternative)
export const fetchBuyerSavedBookings = async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return buyerSavedBookings;
};
