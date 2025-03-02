import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { FileUpload } from "./FileUpload.tsx"; // Assuming you have a file upload component

export function SetupForm() {
  const { user, updateUserSetup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data based on the UserSchema
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      pincode: user?.address?.pincode || "",
      coordinates: {
        latitude: user?.address?.coordinates?.latitude || "",
        longitude: user?.address?.coordinates?.longitude || ""
      }
    },
    // Seller specific fields
    businessType: user?.businessType || "",
    documents: {
      idProof: user?.documents?.idProof || "",
      businessLicense: user?.documents?.businessLicense || ""
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Ensure documents are included in setupData for sellers
      const setupData = user?.role === "seller" 
        ? { 
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            businessType: formData.businessType,
            documents: {
              idProof: formData.documents.idProof,
              businessLicense: formData.documents.businessLicense
            },
            setup: true
          }
        : {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            setup: true
          };
      
      await updateUserSetup(setupData);
      
      toast({
        title: "Setup Completed",
        description: "Your profile has been set up successfully!",
      });
      
      // Redirect based on role
      navigate(user?.role === "seller" ? "/seller" : "/dashboard");
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "There was an error completing your setup.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    // Handle nested objects (address)
    if (id.includes(".")) {
      const [parent, child] = id.split(".");
      
      if (child.includes(".")) {
        const [nestedChild, deepChild] = child.split(".");
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent as keyof typeof formData],
            [nestedChild]: {
              ...(formData[parent as keyof typeof formData] as any)[nestedChild],
              [deepChild]: value
            }
          }
        });
      } else {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent as keyof typeof formData],
            [child]: value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [id]: value
      });
    }
  };
  
  const handleSelectChange = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleFileUpload = (fileUrl: string, fieldName: string) => {
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        [fieldName]: fileUrl
      }
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>
          {user?.role === "seller" 
            ? "Set up your seller account to start listing products" 
            : "Tell us a bit more about yourself"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Address Fields */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Address</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address.street">Street Address</Label>
              <Input
                id="address.street"
                value={formData.address.street}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="address.city">City</Label>
                <Input
                  id="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address.state">State</Label>
                <Input
                  id="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address.pincode">Pin Code</Label>
              <Input
                id="address.pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="address.coordinates.latitude">Latitude</Label>
                <Input
                  id="address.coordinates.latitude"
                  type="number"
                  step="0.000001"
                  value={formData.address.coordinates.latitude}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address.coordinates.longitude">Longitude</Label>
                <Input
                  id="address.coordinates.longitude"
                  type="number"
                  step="0.000001"
                  value={formData.address.coordinates.longitude}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>
          
          {/* Seller-specific fields */}
          {user?.role === "seller" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange(value, "businessType")}
                  defaultValue={formData.businessType}
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
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Required Documents</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="idProof">ID Proof</Label>
                  <FileUpload 
                    id="idProof"
                    onUpload={(url) => handleFileUpload(url, "idProof")}
                    currentFile={formData.documents.idProof}
                    required
                  />
                  {formData.documents.idProof && (
                    <p className="text-xs text-muted-foreground">Document uploaded</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessLicense">Business License</Label>
                  <FileUpload 
                    id="businessLicense"
                    onUpload={(url) => handleFileUpload(url, "businessLicense")}
                    currentFile={formData.documents.businessLicense}
                    required
                  />
                  {formData.documents.businessLicense && (
                    <p className="text-xs text-muted-foreground">Document uploaded</p>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mt-1">
                  Document verification status: <span className="font-medium">Pending</span>
                </p>
              </div>
            </>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Complete Setup"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}