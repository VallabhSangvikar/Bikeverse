import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/card";
import { StarIcon, PencilIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import axios from "axios";

interface Review {
  _id: string;
  bike: {
    title: string;
    _id: string;
    images?: string[];
  };
  seller: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  transactionType: 'purchase' | 'rental';
  createdAt: string;
  booking: string;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: '',
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/reviews/my-reviews', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Sort reviews by date in descending order (latest first)
      const sortedReviews = response.data.sort((a: Review, b: Review) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setReviews(sortedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setReviewForm({
      rating: review.rating,
      comment: review.comment,
    });
    setIsEditing(true);
  };

  const handleUpdateReview = async () => {
    if (!editingReview) return;
    setIsSubmitting(true);
    try {
      await axios.put(
        `http://localhost:3000/api/reviews/${editingReview._id}`,
        {
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Update reviews locally
      setReviews(reviews.map(review =>
        review._id === editingReview._id
          ? { ...review, ...reviewForm }
          : review
      ));

      toast({
        title: "Review Updated",
        description: "Your review has been updated successfully.",
      });

      setIsEditing(false);
      setEditingReview(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium">{user?.phone}</p>
            </div>
            <div>
              <p className="text-gray-500">Role</p>
              <p className="font-medium capitalize">{user?.role}</p>
            </div>
          </div>
        </Card>

        {/* Reviews Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">My Reviews</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {reviews.length === 0 ? (
              <p className="text-gray-500">You haven't written any reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border-b pb-4">
                  <div className="flex gap-4">
                    {review.bike.images?.[0] && (
                      <div className="w-24 h-24 flex-shrink-0">
                        <img 
                          src={review.bike.images[0]}
                          alt={review.bike.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{review.bike.title}</p>
                          <p className="text-sm text-gray-500">
                            Seller: {review.seller.name}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {review.transactionType}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <StarIcon className="h-5 w-5 text-yellow-400" />
                            <span className="ml-1">{review.rating}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditReview(review)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>
              Update your review and rating for this bike.
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
                  setIsEditing(false);
                  setEditingReview(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateReview}
                disabled={!reviewForm.rating || !reviewForm.comment || isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPage;
