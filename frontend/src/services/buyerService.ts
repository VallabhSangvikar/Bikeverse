// Mock data
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.png"
import image3 from "../assets/image3.png"
import image4 from "../assets/image4.png"
const buyerOrders = [
    { id: "1", date: "2023-05-01", total: 15000, status: "Delivered" },
    { id: "2", date: "2023-05-15", total: 3000, status: "Shipped" },
    // Add more mock orders...
  ]
  
  const buyerWishlist = [
    { id: "1", name: "Sport Motorcycle", price: 15000, image: image3},
    { id: "2", name: "Electric Bike", price: 2000, image: image1 },
    // Add more mock wishlist items...
  ]
  
  export const fetchBuyerOrders = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return buyerOrders
  }
  
  export const fetchBuyerWishlist = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return buyerWishlist
  }
  
  