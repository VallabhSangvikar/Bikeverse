import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { Button } from "./ui/button"
import { ShoppingCart } from "lucide-react"

const Header = () => {
  const { user, logout } = useAuth()
  const { items } = useCart()

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          BikeShop
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/products" className="hover:text-primary">
                Products
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link to={user.role === "seller" ? "/seller" : "/dashboard"} className="hover:text-primary">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Button onClick={logout} variant="ghost">
                    Logout
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-primary">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-primary">
                    Signup
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {items.length}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header

