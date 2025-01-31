import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { fetchBuyerOrders, fetchBuyerWishlist } from "../services/buyerService"

const BuyerDashboardPage = () => {
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    const loadBuyerData = async () => {
      const fetchedOrders = await fetchBuyerOrders()
      const fetchedWishlist = await fetchBuyerWishlist()
      setOrders(fetchedOrders)
      setWishlist(fetchedWishlist)
    }
    loadBuyerData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Buyer Dashboard</h1>
      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <span className="text-gray-600">{order.date}</span>
                </div>
                <p className="text-gray-600 mb-2">Total: ${order.total}</p>
                <p className="text-gray-600 mb-2">Status: {order.status}</p>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="wishlist">
          <h2 className="text-2xl font-semibold mb-4">Your Wishlist</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="border p-4 rounded-lg">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600 mb-2">${item.price}</p>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    Add to Cart
                  </Button>
                  <Button variant="destructive" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="profile">
          <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BuyerDashboardPage

