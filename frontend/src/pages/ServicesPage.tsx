import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const ServicesPage = () => {
  // ✅ Define services
  const [services, setServices] = useState([
    { id: 1, name: "Bike Repair", price: 50, description: "Full bike servicing and repair." },
    { id: 2, name: "Tire Replacement", price: 30, description: "Replace old tires with new ones." },
    { id: 3, name: "Brake Check", price: 25, description: "Inspection and adjustment of brakes." },
    { id: 4, name: "Oil Change", price: 40, description: "Engine oil replacement for smooth performance." },
    { id: 5, name: "Battery Check", price: 35, description: "Checking and replacing bike batteries if needed." }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Popular Services</h1>
      <p className="mb-4">Choose from our available bike services.</p>

      {/* ✅ Show services if available, otherwise show "No services available" */}
      {services.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">{service.name}</h2>
              <p className="text-gray-600">{service.description}</p>
              <p className="text-gray-800 font-bold mt-2">${service.price}</p>
              <Link to={`/book/${service.id}`}>
                <Button className="mt-4 w-full">Book Now</Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl">No services available</p>
      )}

      <div className="mt-8 text-center">
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default ServicesPage;
