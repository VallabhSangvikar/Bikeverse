import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { getBikeById, Bike } from "../services/bikeService";

const BikeDetailsPage = () => {
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadBikeDetails(id);
      loadReviews(id);
    }
  }, [id]);

  const loadBikeDetails = async (bikeId: string) => {
    try {
      const data = await getBikeById(bikeId);
      setBike(data);
    } catch (error) {
      console.error("Error loading bike details:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async (bikeId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/reviews/${bikeId}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (!bike) return <div className="text-center p-8">Bike not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-6">
            <img
              src={bike.images[0] || "/placeholder-bike.png"}
              alt={bike.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {bike.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${bike.title} view ${index + 2}`}
                className="w-full h-20 object-cover rounded cursor-pointer"
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{bike.title}</h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-gray-500">Brand</h3>
              <p className="font-semibold">{bike.brand}</p>
            </div>
            <div>
              <h3 className="text-gray-500">Model</h3>
              <p className="font-semibold">{bike.bikeModel}</p>
            </div>
            <div>
              <h3 className="text-gray-500">Year</h3>
              <p className="font-semibold">{bike.year}</p>
            </div>
            <div>
              <h3 className="text-gray-500">Category</h3>
              <p className="font-semibold capitalize">{bike.category}</p>
            </div>
          </div>

          <Card className="p-4 mb-6">
            <h2 className="text-xl font-bold mb-4">Pricing</h2>
            {bike.purpose === 'sale' && (
              <p className="text-2xl font-bold">₹{bike.pricing.salePrice}</p>
            )}
            {bike.purpose === 'rent' && (
              <div className="space-y-2">
                {bike.pricing.rentalPrice?.daily && (
                  <p>Daily: ₹{bike.pricing.rentalPrice.daily}</p>
                )}
                {bike.pricing.rentalPrice?.weekly && (
                  <p>Weekly: ₹{bike.pricing.rentalPrice.weekly}</p>
                )}
                {bike.pricing.rentalPrice?.monthly && (
                  <p>Monthly: ₹{bike.pricing.rentalPrice.monthly}</p>
                )}
              </div>
            )}
            {bike.purpose=="both" && (
              <div className="space-y-2">
                <p className="text-2xl font-bold">Purchase : ₹{bike.pricing.salePrice}</p>
                <div className="space-y-2">
                  Rentals :
                  {bike.pricing.rentalPrice?.daily && (
                    <p>Daily: ₹{bike.pricing.rentalPrice.daily}</p>
                  )}
                  {bike.pricing.rentalPrice?.weekly && (
                    <p>Weekly: ₹{bike.pricing.rentalPrice.weekly}</p>
                  )}
                  {bike.pricing.rentalPrice?.monthly && (
                    <p>Monthly: ₹{bike.pricing.rentalPrice.monthly}</p>
                  )}
                </div>
              </div>
            )}
          </Card>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Specifications</h2>
            <ul className="space-y-2">
              <li>Engine: {bike.specifications.engineCC} CC</li>
              {bike.specifications.mileage && (
                <li>Mileage: {bike.specifications.mileage} kmpl</li>
              )}
              <li>Condition: {bike.specifications.condition}</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button
              className="flex-1"
              onClick={() => navigate(`/book/${bike._id}`)}
            >
              {bike.purpose === 'sale' ? 'Buy Now' : bike.purpose === 'rent' ? 'Rent Now' : 'Buy/Rent Now'}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review._id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{review.reviewer.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BikeDetailsPage;
