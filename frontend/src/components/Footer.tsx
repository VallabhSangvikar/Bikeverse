import { Facebook, Twitter, Instagram } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">
              BikeShop is your one-stop destination for motorcycles, scooters, and electric bikes. We offer a wide range
              of vehicles to suit every rider's needs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/products" className="text-sm hover:text-primary">
                  Products
                </a>
              </li>
              <li>
                <a href="/about" className="text-sm hover:text-primary">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm hover:text-primary">
                  Contact
                </a>
              </li>
              <li>
                <a href="/terms" className="text-sm hover:text-primary">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary">
                <Facebook />
              </a>
              <a href="#" className="text-white hover:text-primary">
                <Twitter />
              </a>
              <a href="#" className="text-white hover:text-primary">
                <Instagram />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>&copy; 2023 BikeShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

