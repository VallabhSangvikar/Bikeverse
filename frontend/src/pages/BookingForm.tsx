import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast"
import { getBikeById } from "../services/bikeService";
import axios from "axios";
import { useBooking } from "../context/BookingContext";

interface BookingFormData {
  message: string;
  startDate?: Date;
  endDate?: Date;
}

const BookingForm = () => {
  const { toast } = useToast();
  const { addBooking } = useBooking();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bike, setBike] = useState<any>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    message: "",
  });
  useEffect(() => {
    const loadBike = async () => {
      if (id) {
        const bikeData = await getBikeById(id);
        setBike(bikeData);
      }
    };
    loadBike();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!bike) return;

      const bookingData = {
        bike: id!,
        seller: bike.seller, // Add seller ID from bike data
        type: bike.purpose === 'sale' ? 'purchase' : 'rental',
        message: [formData.message],
        price: bike.purpose === 'sale' ? bike.pricing.salePrice : bike.pricing.rentalPrice.daily,
        ...(bike.purpose === 'rent' && formData.startDate && formData.endDate && {
          rentalDuration: {
            startDate: formData.startDate,
            endDate: formData.endDate,
          },
        }),
      };
      addBooking(bookingData);
      toast({
        title: "Success",
        description: "Booking request sent successfully!",
      });
      navigate(-1);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create booking. Please try again.",
      });
    }
  };

  if (!bike) return <div>Loading...</div>;

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Card className="p-6">
        {bike.purpose === 'both' ? (
          <div className="mb-6">
            <label className="block font-medium mb-2">Request Type</label>
            <select 
              className="border rounded p-2 w-full"
              onChange={(e) => setBike({ ...bike, purpose: e.target.value })}
              required
            >
              <option value="">Select request type</option>
              <option value="sale">Purchase</option>
              <option value="rent">Rent</option>
            </select>
          </div>
        ) : (
          <h1 className="text-2xl font-bold mb-6">
            {bike.purpose === 'sale' ? 'Purchase' : 'Rent'} Request
          </h1>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-2">
              Message to Seller
            </label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Introduce yourself and let the seller know why you're interested..."
              required
            />
          </div>

          {bike.purpose === 'rent' && (
            <>
              <div>
                <label className="block font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  className="border rounded p-2 w-full"
                  required
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    startDate: new Date(e.target.value)
                  })}
                />
              </div>
              <div>
                <label className="block font-medium mb-2">End Date</label>
                <input
                  type="date"
                  className="border rounded p-2 w-full"
                  required
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    endDate: new Date(e.target.value)
                  })}
                />
              </div>
            </>
          )}

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Send Request
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BookingForm;
