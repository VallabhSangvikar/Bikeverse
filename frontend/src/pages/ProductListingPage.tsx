import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Select } from "../components/ui/select"
import { Card, CardContent, CardFooter } from "../components/ui/card"
import { fetchProducts } from "../services/productService"

const ProductListingPage = () => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  useEffect(() => {
    const loadProducts = async () => {
      const fetchedProducts = await fetchProducts()
      setProducts(fetchedProducts)
    }
    loadProducts()
  }, [])

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (category === "all" || product.category === category),
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "price") return a.price - b.price
      return 0
    })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64"
        />
        <Select value={category} onValueChange={setCategory} className="w-full md:w-48">
          <option value="all">All Categories</option>
          <option value="motorcycle">Motorcycles</option>
          <option value="scooter">Scooters</option>
          <option value="electric">Electric Bikes</option>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy} className="w-full md:w-48">
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-48 object-cover mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">${product.price}</p>
            </CardContent>
            <CardFooter>
              <Link to={`/product/${product.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ProductListingPage

