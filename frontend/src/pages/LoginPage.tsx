import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../hooks/use-toast"
import { LoginForm } from "../components/login-form"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      // If user hasn't completed setup, redirect to setup page
      if (!user.setup) {
        navigate("/setup")
      } else {
        // Otherwise redirect to appropriate dashboard
        navigate(user.role === "seller" ? "/mybikes" : "/")
      }
    }
  }, [user, navigate])


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>
        <LoginForm/>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default LoginPage

