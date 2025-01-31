// Mock data
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.png"
import image4 from "../assets/image4.png"

const sellerProducts = [
    { id: "1", name: "Sport Motorcycle", price: 15000, stock: 5, image: image4},
    { id: "2", name: "City Scooter", price: 3000, stock: 10, image: image2 },
    // Add more mock products...
  ]
  
  const sellerOrders = [
    { id: "1", customer: "John Doe", date: "2023-05-01", total: 15000, status: "Shipped" },
    { id: "2", customer: "Jane Smith", date: "2023-05-02", total: 3000, status: "Processing" },
    // Add more mock orders...
  ]
  
  const sellerAnalytics = {
    totalSales: 50000,
    totalOrders: 20,
    averageOrderValue: 2500,
    monthlyRevenue: [
      { month: "Jan", revenue: 5000 },
      { month: "Feb", revenue: 6000 },
      { month: "Mar", revenue: 7500 },
      // Add more months...
    ],
  }
  
  export const fetchSellerProducts = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return sellerProducts
  }
  
  export const fetchSellerOrders = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return sellerOrders
  }
  
  export const fetchSellerAnalytics = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return sellerAnalytics
  }
  
  