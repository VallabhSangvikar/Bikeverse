import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import App from "./App"
import "./index.css"
import { AuthProvider } from "./context/AuthContext"
import { BookingProvider } from "./context/BookingContext" // Ensure correct import

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <BookingProvider> {/* Corrected from CartProvider to BookingProvider */}
          <App />
        </BookingProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
)
