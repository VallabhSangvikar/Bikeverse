import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Bike, searchBikes } from "../services/bikeService";

const HomePage = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    purpose: "",
    city: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadBikes();
  }, [filters]);

  const loadBikes = async () => {
    try {
      const data = await searchBikes(filters);
      setBikes(data);
    } catch (error) {
      console.error("Error loading bikes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Ride</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by city..."
            value={filters.city}
            onChange={(e) =>
              setFilters({ ...filters, city: e.target.value })
            }
          />
          <select
            className="border p-2 rounded"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">All Categories</option>
            <option value="sports">Sports</option>
            <option value="cruiser">Cruiser</option>
            <option value="vintage">Vintage</option>
            <option value="scooter">Scooter</option>
            <option value="commuter">Commuter</option>
            <option value="adventure">Adventure</option>
          </select>
          <select
            className="border p-2 rounded"
            value={filters.purpose}
            onChange={(e) =>
              setFilters({ ...filters, purpose: e.target.value })
            }
          >
            <option value="">All Purposes</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>
      </section>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bikes.map((bike) => (
            <Card key={bike._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <img
                  src={bike.images[0] || "/placeholder-bike.png"}
                  alt={bike.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold mb-2">{bike.title}</h2>
                <p className="text-gray-600 mb-2">
                  {bike.brand} {bike.bikeModel} ({bike.year})
                </p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold">
                    {bike.pricing.salePrice
                      ? `₹${bike.pricing.salePrice}`
                      : `₹${bike.pricing.rentalPrice?.daily}/day`}
                  </span>
                  <span className="text-sm text-gray-500">{bike.location.city}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full"
                  onClick={() => navigate(`/bikes/${bike._id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
