import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

const BikesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Bikes</h1>
      <p className="text-gray-600">Choose a bike for your ride.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="border p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Royal Enfield</h2>
          <p className="text-gray-600">Classic 350 - ₹1200/day</p>
          <Button className="mt-4 w-full" onClick={() => navigate("/bookings")}>
            Book Now
          </Button>
        </div>
        <div className="border p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Yamaha R15</h2>
          <p className="text-gray-600">V4 - ₹900/day</p>
          <Button className="mt-4 w-full" onClick={() => navigate("/bookings")}>
            Book Now
          </Button>
        </div>
        {/* Add more bikes here */}
      </div>
    </div>
  );
};

export default BikesPage;
