export interface Bike {
  _id: string;
  title: string;
  category: string;
  images: string[]; // Array of images
  pricing: {
    salePrice?: number;
    rentalPrice?: {
      hourly?: number;
      daily?: number;
      weekly?: number;
      monthly?: number;
    };
  };
}

export const fetchBikes = async (): Promise<Bike[]> => {
  try {
    const response = await fetch("http://localhost:3000/api/bikes");
    if (!response.ok) throw new Error("Failed to fetch bikes");

    const data: Bike[] = await response.json();
    
    return data.map((bike) => ({
      _id: bike._id,
      title: bike.title,
      category: bike.category,
      images: bike.images || ["https://via.placeholder.com/300"], // Default image if missing
      pricing: bike.pricing || {},
    }));
  } catch (error) {
    console.error("Error fetching bikes:", error);
    return [];
  }
};
