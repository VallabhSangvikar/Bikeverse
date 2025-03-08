import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Trash2, ChevronDown, ChevronUp, ExternalLink, StarIcon } from "lucide-react";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useToast } from "../hooks/use-toast";
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";

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

interface ReviewForm {
  seller: string;
  reviewer: string;
  bike: string;
  rating: number;
  comment: string;
  transactionType: 'rental' | 'purchase';
  booking: string;
}

const BookPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [cancelMessage, setCancelMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    rating: 0,
    comment: '',
    bike:'',
    seller: '',
    reviewer: '',
    transactionType: 'purchase',
    booking: '',
  });
  const [showReviewDialog, setShowReviewDialog] = useState(false);

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

  const handleCancelBooking = async () => {
    if (!cancelBookingId) return;
    setIsSubmitting(true);
    try {
      await axios.patch(`http://localhost:3000/api/bookings/${cancelBookingId}/status`, 
        { message: cancelMessage, status: 'cancelled' },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Update the booking status locally
      setBookings(bookings.map(booking => 
        booking._id === cancelBookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      ));
      
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      
      setCancelBookingId(null);
      setCancelMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.bike) return;
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:3000/api/reviews', 
        reviewForm,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      
      setShowReviewDialog(false);
      setReviewForm({rating: 0,
        comment: '',
        bike:'',
        seller: '',
        reviewer: '',
        transactionType: 'purchase',booking: ''});
    } catch (error) {
      toast({
        title: "Error",
        description: "You already reviewed or Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
                            <div className="flex gap-2">
                              {booking.status === 'completed' && (
                                <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setReviewForm({
                                          bike: booking.bike._id,
                                          seller: booking.seller._id,
                                          rating: 0,
                                          comment: '',
                                          reviewer: '', // This will be set by the backend
                                          transactionType: booking.type, // Use the booking type directly,
                                          booking: booking._id
                                        });
                                        setShowReviewDialog(true);
                                      }}
                                    >
                                      <StarIcon className="h-4 w-4 mr-2" />
                                      Write Review
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Write a Review</DialogTitle>
                                      <DialogDescription>
                                        Share your experience about the bike and service. Your feedback helps others make better decisions.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <label className="block text-sm font-medium mb-2">Rating</label>
                                        <div className="flex gap-2">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                              key={star}
                                              type="button"
                                              onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                              className={`p-1 rounded-full hover:bg-gray-100 transition-colors
                                                ${reviewForm.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                            >
                                              <StarIcon className="h-6 w-6" />
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium mb-2">Comment</label>
                                        <Textarea
                                          value={reviewForm.comment}
                                          onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                          placeholder="Share your experience..."
                                          className="min-h-[100px]"
                                        />
                                      </div>
                                      <div className="flex justify-end gap-2">
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            setShowReviewDialog(false);
                                            setReviewForm({
                                              rating: 0,
                                              comment: '',
                                              bike: '',
                                              seller: '',
                                              reviewer: '',
                                              transactionType: 'purchase',
                                              booking: ''
                                            });
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          onClick={handleSubmitReview}
                                          disabled={!reviewForm.rating || !reviewForm.comment || isSubmitting}
                                        >
                                          {isSubmitting ? "Submitting..." : "Submit Review"}
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                              {(booking.status === 'pending' || booking.status === 'accepted') && (
                                <Dialog open={cancelBookingId === booking._id} onOpenChange={(open) => {
                                  if (!open) {
                                    setCancelBookingId(null);
                                    setCancelMessage('');
                                  }
                                }}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => setCancelBookingId(booking._id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Cancel Booking
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Cancel Booking</DialogTitle>
                                      <DialogDescription>
                                        Please provide a reason for cancellation. This will help us improve our service.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <p className="text-sm text-gray-600">
                                        Please provide a reason for cancellation:
                                      </p>
                                      <Textarea
                                        value={cancelMessage}
                                        onChange={(e) => setCancelMessage(e.target.value)}
                                        placeholder="Enter your reason for cancellation..."
                                        className="min-h-[100px]"
                                      />
                                      <div className="flex justify-end gap-2">
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            setCancelBookingId(null);
                                            setCancelMessage('');
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          onClick={handleCancelBooking}
                                          disabled={!cancelMessage || isSubmitting}
                                        >
                                          {isSubmitting ? "Cancelling..." : "Confirm Cancel"}
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
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
      
      <Button className="mt-8 w-full md:w-auto" onClick={() => navigate("/")}>
        Book a Bike
      </Button>
    </div>
  );
};

export default BookPage;
