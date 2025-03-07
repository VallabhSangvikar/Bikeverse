import { Link, useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { Button } from "../components/ui/button";
import { Trash2, Calendar, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useToast } from "../hooks/use-toast";
import { format } from 'date-fns';

interface Seller {
  name: string;
  phone: string;
  email: string;
  rating: number;
  documents?: {
    idProof: string;
    businessLicense: string;
    verificationStatus: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

interface BikeDetails {
  title: string;
  brand?: string;
  category?: string;
  images?: string[];
  specifications?: {
    engineCC: number;
    mileage: number;
    condition: string;
  };
}

interface Booking {
  _id: string;
  type: 'rental' | 'purchase';
  status: string;
  price: number;
  message: string;
  bike: BikeDetails;
  seller: Seller;
  rentalDuration?: {
    startDate: string;
    endDate: string;
  };
  createdAt: string;
}

const BookPage = () => {
  const { removeBooking } = useBooking();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/bookings/my-bookings', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data);
      setBookings(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleBookingDetails = (bookingId: string) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">You have no bookings yet</p>
          <Link to="/services">
            <Button>Book a Service</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {['rental', 'purchase'].map((type) => {
            const typeBookings = bookings.filter(b => b.type === type);
            if (typeBookings.length === 0) return null;

            return (
              <div key={type} className="space-y-4">
                <h2 className="text-2xl font-semibold capitalize">{type} Bookings</h2>
                <div className="grid gap-4">
                  {typeBookings.map((booking) => (
                    <div key={booking._id} 
                      className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex gap-6">
                        {booking.bike.images?.[0] && (
                          <div className="w-48 h-32 flex-shrink-0">
                            <img 
                              src={booking.bike.images[0]}
                              alt={booking.bike.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold">{booking.bike.title}</h3>
                              <div className="flex gap-2 mt-1 text-sm text-gray-600">
                                {booking.bike.brand && (
                                  <span>{booking.bike.brand}</span>
                                )}
                                {booking.bike.category && (
                                  <span>• {booking.bike.category}</span>
                                )}
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>

                          {booking.type === 'rental' && booking.rentalDuration && (
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Start Date</p>
                                <p className="font-medium">
                                  {format(new Date(booking.rentalDuration.startDate), 'PPP')}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">End Date</p>
                                <p className="font-medium">
                                  {format(new Date(booking.rentalDuration.endDate), 'PPP')}
                                </p>
                              </div>
                            </div>
                          )}

                          {booking.bike.specifications && (
                            <div className="mt-4 flex gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Engine:</span>
                                <span className="ml-1 font-medium">
                                  {booking.bike.specifications.engineCC}cc
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Mileage:</span>
                                <span className="ml-1 font-medium">
                                  {booking.bike.specifications.mileage} kmpl
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Condition:</span>
                                <span className="ml-1 font-medium capitalize">
                                  {booking.bike.specifications.condition}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="mt-4 flex justify-between items-center">
                            <p className="text-lg font-semibold text-green-600">
                              ₹{booking.price.toLocaleString()}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleBookingDetails(booking._id)}
                            >
                              {expandedBooking === booking._id ? 
                                <ChevronUp className="h-5 w-5" /> : 
                                <ChevronDown className="h-5 w-5" />}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {expandedBooking === booking._id && (
                        <div className="mt-4 pt-4 border-t">
                          <h3 className="font-medium mb-4">Seller Details</h3>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <p className="text-gray-600">Name:</p>
                                <p className="font-medium">{booking.seller.name}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Rating:</p>
                                <p className="font-medium">{booking.seller.rating}/5</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Phone:</p>
                                <p className="font-medium">{booking.seller.phone}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Email:</p>
                                <p className="font-medium">{booking.seller.email}</p>
                              </div>
                            </div>

                            {(booking.status === 'completed' || booking.status === 'accepted') && (
                              <div className="space-y-4">
                                {booking.seller.address && (
                                  <div>
                                    <p className="text-gray-600 mb-1">Address:</p>
                                    <p className="font-medium">{booking.seller.address.street}</p>
                                    <p className="font-medium">
                                      {booking.seller.address.city}, {booking.seller.address.state}
                                    </p>
                                    <p className="font-medium">{booking.seller.address.pincode}</p>
                                  </div>
                                )}

                                {booking.seller.documents && (
                                  <div className="space-y-2">
                                    <p className="text-gray-600">Documents:</p>
                                    <div className="flex gap-4">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2"
                                        onClick={() => window.open(booking.seller.documents?.idProof, '_blank')}
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                        
                                        ID Proof
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2"
                                        onClick={() => window.open(booking.seller.documents?.businessLicense, '_blank')}
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                        Business License
                                      </Button>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                      Verification Status: 
                                      <span className={`ml-1 ${
                                        booking.seller.documents.verificationStatus === 'verified' 
                                          ? 'text-green-600' 
                                          : 'text-yellow-600'
                                      }`}>
                                        {booking.seller.documents.verificationStatus}
                                      </span>
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <Button className="mt-8 w-full md:w-auto" onClick={() => navigate("/bikes")}>
        Book a Bike
      </Button>
    </div>
  );
};

export default BookPage;
