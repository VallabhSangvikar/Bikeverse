import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "../components/ui/carousel";
import { Button } from "../components/ui/button";
import { fetchBikes, Bike } from "../services/bike.service";

const HomePage = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);

  useEffect(() => {
    const loadBikes = async () => {
      try {
        const bikesData = await fetchBikes();
        setBikes(bikesData);
      } catch (error) {
        console.error("Failed to load bikes", error);
      }
    };
    loadBikes();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 text-left">
        <h1 className="text-4xl font-bold mb-4">Welcome to BikeShop</h1>
        <p className="text-xl mb-6">Discover the best motorcycles, scooters, and electric bikes.</p>
        <Link to="/products">
          <Button size="lg">Shop Now</Button>
        </Link>
      </section>

      {/* Featured Bikes */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Featured Bikes</h2>
        <Carousel className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bikes.length > 0 ? (
            bikes.map((bike) => (
              <div key={bike._id} className="p-4 shadow-md rounded-lg bg-white">
                <img
                  src={bike.images?.[0] || "https://via.placeholder.com/300"}
                  alt={bike.title}
                  className="w-full h-64 object-cover mb-4 rounded-lg"
                />
                <h3 className="text-lg font-semibold mb-2">{bike.title}</h3>
                <p className="text-gray-600 mb-2">
                  ${bike.pricing?.salePrice || bike.pricing?.rentalPrice?.daily || "N/A"}
                </p>
                <Link to={`/bike/${bike._id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No bikes available at the moment.</p>
          )}
        </Carousel>
      </section>

      {/* Selling & Categories Section */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-primary text-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Sell Your Bike</h2>
          <p className="mb-4">
            Got a bike you want to sell? List it on our platform and reach thousands of potential buyers.
          </p>
          <Link to="/sell">
            <Button variant="secondary">Start Selling</Button>
          </Link>
        </div>
        <div className="bg-secondary p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Explore Categories</h2>
          <p className="mb-4">Browse through our wide range of motorcycles, scooters, and electric bikes.</p>
          <Link to="/products">
            <Button>View Categories</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
