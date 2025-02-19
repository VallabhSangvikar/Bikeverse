import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "../components/ui/carousel";
import { Button } from "../components/ui/button";
import { fetchPopularServices } from "../services/serviceService";

// Define the type for a service
type Service = {
  id: number;
  name: string;
  price: number;
  image?: string;
};

const ServicesPage = () => {
  const [popularServices, setPopularServices] = useState<Service[]>([]);

  useEffect(() => {
    const loadPopularServices = async () => {
      try {
        const services: Service[] = await fetchPopularServices();
        setPopularServices(services || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    loadPopularServices();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold mb-6">Popular Services</h2>
      <Carousel className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {popularServices.length > 0 ? (
          popularServices.map((service) => (
            <div key={service.id} className="p-4">
              <img
                src={service.image ? service.image : "/assets/service-placeholder.png"}
                alt={service.name}
                className="w-full h-64 object-cover mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-2">${service.price}</p>
              <Link to={`/service/${service.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
            </div>
          ))
        ) : (
          <p>No services available</p>
        )}
      </Carousel>
    </div>
  );
};

export default ServicesPage;
