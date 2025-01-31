import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { fetchSellerProducts, fetchSellerOrders, fetchSellerAnalytics } from "../services/sellerService"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const SellerDashboardPage = () => {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    const loadSellerData = async () => {
      const fetchedProducts = await fetchSellerProducts()
      const fetchedOrders = await fetchSellerOrders()
      const fetchedAnalytics = await fetchSellerAnalytics()
      setProducts(fetchedProducts)
      setOrders(fetchedOrders)
      setAnalytics(fetchedAnalytics)
    }
    loadSellerData()
  }, [])

  const handleAddProduct = (e) => {
    e.preventDefault()
    // Add product logic here
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>
      <Tabs defaultValue="inventory">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory">
          <h2 className="text-2xl font-semibold mb-4">Your Products</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border p-4 rounded-lg">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
                <p className="text-gray-600">Stock: {product.stock}</p>
                <div className="mt-4 space-x-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <h3 className="text-xl font-semibold mt-8 mb-4">Add New Product</h3>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input id="productName" name="productName" required />
            </div>
            <div>
              <Label htmlFor="productPrice">Price</Label>
              <Input id="productPrice" name="productPrice" type="number" required />
            </div>
            <div>
              <Label htmlFor="productStock">Stock</Label>
              <Input id="productStock" name="productStock" type="number" required />
            </div>
            <Button type="submit">Add Product</Button>
          </form>
        </TabsContent>
        <TabsContent value="orders">
          <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Order ID</th>
                  <th className="p-2 text-left">Customer</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Total</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-2">{order.id}</td>
                    <td className="p-2">{order.customer}</td>
                    <td className="p-2">{order.date}</td>
                    <td className="p-2">${order.total}</td>
                    <td className="p-2">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <h2 className="text-2xl font-semibold mb-4">Sales Analytics</h2>
          {analytics && (
            <div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Monthly Revenue</h3>
                <LineChart width={600} height={300} data={analytics.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                </LineChart>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">Total Sales</h4>
                  <p className="text-3xl font-bold">${analytics.totalSales}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">Total Orders</h4>
                  <p className="text-3xl font-bold">{analytics.totalOrders}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">Average Order Value</h4>
                  <p className="text-3xl font-bold">${analytics.averageOrderValue}</p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SellerDashboardPage

