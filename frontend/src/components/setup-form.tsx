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
      coordinates: {
        latitude: null as number | null,
        longitude: null as number | null
      }
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

  const handleGetCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            address: {
              ...formData.address,
              coordinates: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            }
          });
          toast({
            title: "Location Retrieved",
            description: "Your coordinates have been added successfully.",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Failed to get your location. Please enter coordinates manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append basic info
      formDataToSend.append("phone", formData.phone);
      // formDataToSend.append("address", JSON.stringify(formData.address));
      formDataToSend.append("state", formData.address.state);
      formDataToSend.append("city", formData.address.city);
      formDataToSend.append("street", formData.address.street);
      formDataToSend.append("pincode", formData.address.pincode);
      formDataToSend.append("latitude", formData.address.coordinates.latitude?.toString() || "");
      formDataToSend.append("longitude", formData.address.coordinates.longitude?.toString() || "");

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
      user.setup = true;
      localStorage.setItem("user", JSON.stringify(user));
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
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                placeholder="Street Address (e.g., 123 Main Street, Apartment 4B)"
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
                  placeholder="City (e.g., Mumbai)"
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
                  placeholder="State (e.g., Maharashtra)"
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
                placeholder="Postal Code (e.g., 400001)"
                value={formData.address.pincode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, pincode: e.target.value },
                  })
                }
                required
              />
              
              <div className="mt-4 space-y-2">
                <Label>Location Coordinates</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Latitude (e.g., 19.0760)"
                    type="number"
                    step="any"
                    value={formData.address.coordinates.latitude || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { 
                          ...formData.address, 
                          coordinates: {
                            ...formData.address.coordinates,
                            latitude: parseFloat(e.target.value)
                          } 
                        },
                      })
                    }
                    required
                  />
                  <Input
                    placeholder="Longitude (e.g., 72.8777)"
                    type="number"
                    step="any"
                    value={formData.address.coordinates.longitude || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { 
                          ...formData.address, 
                          coordinates: {
                            ...formData.address.coordinates,
                            longitude: parseFloat(e.target.value)
                          } 
                        },
                      })
                    }
                    required
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={handleGetCoordinates}
                >
                  Get Current Location
                </Button>
              </div>
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
                  required
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
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'idProof')}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload Aadhar Card, PAN Card, or other valid ID (PDF, JPG, PNG)
                </p>
              </div>

              <div>
                <Label htmlFor="businessLicense">Business License</Label>
                <Input
                  id="businessLicense"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'businessLicense')}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload GST Certificate, Trade License, or other business documents (PDF, JPG, PNG)
                </p>
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