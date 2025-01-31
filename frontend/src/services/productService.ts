// Mock data
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.png"
import image3 from "../assets/image3.png"
import image4 from "../assets/image4.png"
const products = [
    { id: "1", name: "Sport Motorcycle", price: 15000, category: "motorcycle", image: image1 },
    { id: "2", name: "City Scooter", price: 3000, category: "scooter", image: image2 },
    { id: "3", name: "Electric Bike", price: 2000, category: "electric", image:image4 },
    // Add more mock products...
  ]
  
  export const fetchProducts = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return products
  }
  
  export const fetchProductById = async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    const product = products.find((p) => p.id === id)
    if (!product) throw new Error("Product not found")
    return {
      ...product,
      description: "This is a detailed description of the product.",
      specifications: ["Spec 1", "Spec 2", "Spec 3"],
      rating: 4.5,
      reviews: [
        { name: "John Doe", rating: 5, comment: "Great product!" },
        { name: "Jane Smith", rating: 4, comment: "Good value for money." },
      ],
    }
  }
  
  export const fetchFeaturedProducts = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return products.slice(0, 3) // Return first 3 products as featured
  }
  
  