import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SetupForm } from "../components/setup-form";

export default function SetupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is already set up, redirect to appropriate dashboard
    if (user?.setup) {
      navigate(user.role === "seller" ? "/seller" : "/dashboard");
    }
    
    // If no user is logged in, redirect to login
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          {user?.role === "seller" ? "Seller Onboarding" : "Complete Your Profile"}
        </h1>
        <SetupForm />
      </div>
    </div>
  );
}
