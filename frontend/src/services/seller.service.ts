import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const sellerService = {
  // Bike-related endpoints
  getSellerBikes: async () => {
    const response = await axios.get(`${API_URL}/bikes/seller`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  createBike: async (bikeData: any) => {
    const response = await axios.post(`${API_URL}/bikes`, bikeData, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  updateBike: async (id: string, bikeData: any) => {
    const response = await axios.put(`${API_URL}/bikes/${id}`, bikeData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  deleteBike: async (id: string) => {
    const response = await axios.delete(`${API_URL}/bikes/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  getSellerBookings: async () => {
    const response = await axios.get(`${API_URL}/bookings/my-bookings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  updateBookingStatus: async (bookingId: string, status: string, message?: string) => {
    const response = await axios.patch(
      `${API_URL}/bookings/${bookingId}/status`,
      { status, message },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    );
    return response.data;
  },

  getSellerReviews: async () => {
    const response = await axios.get(`${API_URL}/reviews/seller-reviews`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  }
};
