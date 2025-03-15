import axios from 'axios';

const API_URL = 'http://localhost:3000/api/bikes';

export interface Bike {
  _id: string;
  title: string;
  brand: string;
  bikeModel: string;
  year: number;
  category: string;
  description: string;
  images: string[];
  purpose: 'sale' | 'rent' | 'both';
  pricing: {
    salePrice?: number;
    rentalPrice?: {
      hourly?: number;
      daily?: number;
      weekly?: number;
      monthly?: number;
    };
  };
  specifications: {
    engineCC: number;
    mileage?: number;
    condition: 'new' | 'used';
  };
  location: {
    city: string;
    state: string;
  };
  status: 'available' | 'sold' | 'rented' | 'maintenance';
}

export const searchBikes = async (params: Record<string, any>) => {
  const response = await axios.get(`${API_URL}/search`, { params });
  return response.data;
};

export const getBikeById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Add these new functions
export const getBikesToCompare = async (bikeIds: string[]) => {
  const bikes = await Promise.all(
    bikeIds.map(id => getBikeById(id))
  );
  return bikes;
};
