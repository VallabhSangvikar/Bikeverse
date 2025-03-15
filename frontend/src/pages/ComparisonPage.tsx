import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getBikesToCompare, Bike } from "../services/bikeService";
import { Button } from "../components/ui/button";

const ComparisonPage = () => {
  const [searchParams] = useSearchParams();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const bikeIds = searchParams.get("bikes")?.split(",") || [];
    if (bikeIds.length) {
      loadBikes(bikeIds);
    }
  }, [searchParams]);

  const loadBikes = async (bikeIds: string[]) => {
    try {
      const data = await getBikesToCompare(bikeIds);
      setBikes(data);
    } catch (error) {
      console.error("Error loading bikes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (!bikes.length) return <div className="text-center p-8">No bikes selected for comparison</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Compare Bikes</h1>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="p-4 font-bold bg-gray-50">Image</td>
              {bikes.map((bike) => (
                <td key={bike._id} className="p-4 text-center">
                  <img 
                    src={bike.images[0] || "/placeholder-bike.png"} 
                    alt={bike.title} 
                    className="w-32 h-32 object-cover mx-auto rounded"
                  />
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-bold bg-gray-50">Name</td>
              {bikes.map((bike) => (
                <td key={bike._id} className="p-4">{bike.title}</td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-bold bg-gray-50">Price</td>
              {bikes.map((bike) => (
                <td key={bike._id} className="p-4">
                  {bike.pricing.salePrice && `₹${bike.pricing.salePrice.toLocaleString()}`}
                  {bike.pricing.rentalPrice?.daily && ` | ₹${bike.pricing.rentalPrice.daily}/day`}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-bold bg-gray-50">Engine</td>
              {bikes.map((bike) => (
                <td key={bike._id} className="p-4">{bike.specifications.engineCC}cc</td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-bold bg-gray-50">Mileage</td>
              {bikes.map((bike) => (
                <td key={bike._id} className="p-4">{bike.specifications.mileage} kmpl</td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-bold bg-gray-50">Location</td>
              {bikes.map((bike) => (
                <td key={bike._id} className="p-4">{bike.location.city}</td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-bold bg-gray-50">Actions</td>
              {bikes.map((bike) => (
                <td key={bike._id} className="p-4">
                  <Button onClick={() => navigate(`/bikes/${bike._id}`)}>
                    View Details
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonPage;
