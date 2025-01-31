import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Carousel } from "../components/ui/carousel"
import { Button } from "../components/ui/button"
import { fetchFeaturedProducts } from "../services/productService"

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      const products = await fetchFeaturedProducts()
      setFeaturedProducts(products)
    }
    loadFeaturedProducts()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to BikeShop</h1>
        <p className="text-xl mb-6">Discover the best motorcycles, scooters, and electric bikes.</p>
        <Link to="/products">
          <Button size="lg">Shop Now</Button>
        </Link>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Featured Products</h2>
        <Carousel className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredProducts.map((product) => (
            console.log(product),
            <div key={product.id} className="p-4">
              <img
                src={product.image || "../assets/image.png"}
                alt={product.name}
                className="w-full h-64 object-cover mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">${product.price}</p>
              <Link to={`/product/${product.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
            </div>
          ))}
        </Carousel>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-primary text-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Sell Your Bike</h2>
          <p className="mb-4">
            Got a bike you want to sell? List it on our platform and reach thousands of potential buyers.
          </p>
          <Link to="/sell">
            <Button variant="secondary">Start Selling</Button>
          </Link>
        </div>
        <div className="bg-secondary p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Explore Categories</h2>
          <p className="mb-4">Browse through our wide range of motorcycles, scooters, and electric bikes.</p>
          <Link to="/products">
            <Button>View Categories</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage

