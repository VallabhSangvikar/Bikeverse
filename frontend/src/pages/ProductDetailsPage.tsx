import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { useCart } from "../context/BookingContext"
import { fetchProductById } from "../services/productService"
import { Star, Plus, Minus } from "lucide-react"

const ProductDetailsPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    const loadProduct = async () => {
      const fetchedProduct = await fetchProductById(id)
      setProduct(fetchedProduct)
    }
    loadProduct()
  }, [id])

  if (!product) return <div>Loading...</div>

  const handleAddToCart = () => {
    addToCart({ ...product, quantity })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold mb-4">${product.price}</p>
          <div className="flex items-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`h-5 w-5 ${star <= product.rating ? "text-yellow-400" : "text-gray-300"}`} />
            ))}
            <span className="ml-2 text-gray-600">({product.reviews.length} reviews)</span>
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="flex items-center mb-6">
            <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="mx-4 text-xl">{quantity}</span>
            <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleAddToCart} className="w-full mb-4">
            Add to Cart
          </Button>
          <Button variant="secondary" className="w-full">
            Buy Now
          </Button>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Product Specifications</h2>
        <ul className="list-disc pl-6">
          {product.specifications.map((spec, index) => (
            <li key={index} className="mb-2">
              {spec}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        {product.reviews.map((review, index) => (
          <div key={index} className="mb-6 border-b pb-4">
            <div className="flex items-center mb-2">
              <span className="font-semibold mr-2">{review.name}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductDetailsPage

