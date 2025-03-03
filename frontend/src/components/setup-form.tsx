import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loader2 } from "lucide-react";

export function SetupForm() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    businessType: "showroom" as "showroom" | "individual",
    documents: {
      idProof: null as File | null,
      businessLicense: null as File | null,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'idProof' | 'businessLicense') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [type]: file
        }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append basic info
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", JSON.stringify(formData.address));
      
      // Add seller-specific data
      if (user?.role === "seller") {
        formDataToSend.append("businessType", formData.businessType);
        if (formData.documents.idProof) {
          formDataToSend.append("idProof", formData.documents.idProof);
        }
        if (formData.documents.businessLicense) {
          formDataToSend.append("businessLicense", formData.documents.businessLicense);
        }
      }
      console.log("formData"+JSON.stringify(formDataToSend));
      // Call API
      const response = await fetch(`${API_URL}/auth/setupProfile/${user?._id}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${user?.token}`,
        },
        body: formDataToSend,
    });
    if (!response.ok) {
        throw new Error("Failed to setup profile");
    }
      toast({
        title: "Setup Complete",
        description: "Your profile has been set up successfully!",
      });

      // Redirect based on role
      navigate(user?.role === "seller" ? "/seller" : "/dashboard");
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "There was an error setting up your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                placeholder="Street Address"
                value={formData.address.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value },
                  })
                }
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="City"
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value },
                    })
                  }
                  required
                />
                <Input
                  placeholder="State"
                  value={formData.address.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <Input
                placeholder="Postal Code"
                value={formData.address.pincode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, pincode: e.target.value },
                  })
                }
                required
              />
            </div>
          </div>

          {/* Seller-specific Fields */}
          {user?.role === "seller" && (
            <div className="space-y-4">
              <div>
                <Label>Business Type</Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value: "showroom" | "individual") =>
                    setFormData({ ...formData, businessType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="showroom">Showroom</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="idProof">ID Proof</Label>
                <Input
                  id="idProof"
                  type="file"
                  onChange={(e) => handleFileChange(e, 'idProof')}
                  required
                />
              </div>

              <div>
                <Label htmlFor="businessLicense">Business License</Label>
                <Input
                  id="businessLicense"
                  type="file"
                  onChange={(e) => handleFileChange(e, 'businessLicense')}
                  required
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              "Complete Setup"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
