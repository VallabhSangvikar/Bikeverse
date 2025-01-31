import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../hooks/use-toast"
import { Sign } from "crypto"
import { SignupForm } from "../components/SignupForm"

const SignupPage = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("buyer")
  const { signup } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signup(name, email, password, role)
      toast({
        title: "Signup Successful",
        description: "Welcome to our platform!",
      })
      navigate("/")
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "An error occurred during signup. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Sign Up</h1>
        <SignupForm/>
      </div>
    </div>
  )
}

export default SignupPage

