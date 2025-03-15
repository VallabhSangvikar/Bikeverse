import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/use-toast";
import { Bike } from "../services/bikeService";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";

const MyBikesPage = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    bikeModel: "",
    year: "",
    category: "",
    description: "",
    images: [""],
    purpose: "sale",
    pricing: {
      salePrice: "",
      rentalPrice: {
        hourly: "",
        daily: "",
        weekly: "",
        monthly: "",
      }
    },
    specifications: {
      engineCC: "",
      mileage: "",
      condition: "new" // Changed to match schema: 'new' | 'used'
    },
    location: {
      address: "", // Added to match schema
      city: "",
      state: "",
      coordinates: {
        latitude: "",
        longitude: ""
      }
    },
    status: "available" // Added to match schema
  });

  useEffect(() => {
    fetchMyBikes();
  }, []);

  const fetchMyBikes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/bikes/seller`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      setBikes(response.data);
    } catch (error) {
      console.error("Error fetching bikes:", error);
      toast({
        title: "Error",
        description: "Failed to load your bikes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBike = async () => {
    try {
      await axios.post(`${API_URL}/bikes`, formData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      
      toast({
        title: "Success",
        description: "Bike added successfully!",
      });
      
      setIsAddDialogOpen(false);
      resetForm();
      fetchMyBikes();
    } catch (error) {
      console.error("Error adding bike:", error);
      toast({
        title: "Error",
        description: "Failed to add bike. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBike = async () => {
    if (!selectedBike) return;
    
    try {
      await axios.put(`${API_URL}/bikes/${selectedBike._id}`, formData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      
      toast({
        title: "Success",
        description: "Bike updated successfully!",
      });
      
      setIsEditDialogOpen(false);
      resetForm();
      fetchMyBikes();
    } catch (error) {
      console.error("Error updating bike:", error);
      toast({
        title: "Error",
        description: "Failed to update bike. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBike = async () => {
    if (!selectedBike) return;
    
    try {
      await axios.delete(`${API_URL}/bikes/${selectedBike._id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      
      toast({
        title: "Success",
        description: "Bike deleted successfully!",
      });
      
      setIsDeleteDialogOpen(false);
      fetchMyBikes();
    } catch (error) {
      console.error("Error deleting bike:", error);
      toast({
        title: "Error",
        description: "Failed to delete bike. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (bike: Bike) => {
    setSelectedBike(bike);
    setFormData({
      title: bike.title,
      brand: bike.brand,
      bikeModel: bike.bikeModel,
      year: bike.year.toString(),
      category: bike.category,
      description: bike.description,
      purpose: bike.purpose,
      pricing: {
        salePrice: bike.pricing.salePrice?.toString() || "",
        rentalPrice: {
          hourly: bike.pricing.rentalPrice?.hourly?.toString() || "",
          daily: bike.pricing.rentalPrice?.daily?.toString() || "",
          weekly: bike.pricing.rentalPrice?.weekly?.toString() || "",
          monthly: bike.pricing.rentalPrice?.monthly?.toString() || "",
        }
      },
      specifications: {
        engineCC: bike.specifications.engineCC.toString(),
        mileage: bike.specifications.mileage.toString(),
        condition: bike.specifications.condition,
      },
      images: bike.images,
      location: {
        address: bike.location.address,
        city: bike.location.city,
        state: bike.location.state,
        coordinates: {
          latitude: bike.location.coordinates.latitude.toString(),
          longitude: bike.location.coordinates.longitude.toString()
        }
      },
      status: bike.status
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (bike: Bike) => {
    setSelectedBike(bike);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      brand: "",
      bikeModel: "",
      year: "",
      category: "",
      description: "",
      images: [""],
      purpose: "sale",
      pricing: {
        salePrice: "",
        rentalPrice: {
          hourly: "",
          daily: "",
          weekly: "",
          monthly: ""
        }
      },
      specifications: {
        engineCC: "",
        mileage: "",
        condition: "new"
      },
      location: {
        address: "",
        city: "",
        state: "",
        coordinates: {
          latitude: "",
          longitude: ""
        }
      },
      status: "available"
    });
    setSelectedBike(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNestedInputChange = (e: React.ChangeEvent<HTMLInputElement>, parentKey: string, childKey: string) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey as keyof typeof prev],
        [childKey]: value
      }
    }));
  };

  const handleRentalPriceChange = (e: React.ChangeEvent<HTMLInputElement>, period: string) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        rentalPrice: {
          ...prev.pricing.rentalPrice,
          [period]: value
        }
      }
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Bikes</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Bike
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading your bikes...</div>
      ) : bikes.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">You haven't added any bikes yet</h2>
          <Button onClick={() => setIsAddDialogOpen(true)}>Add Your First Bike</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bikes.map((bike) => (
            <Card key={bike._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 pt-4">
                <div 
                  className="relative cursor-pointer mb-4"
                  onClick={() => navigate(`/bikes/${bike._id}`)}
                >
                  <img
                    src={bike.images[0] || "/placeholder-bike.png"}
                    alt={bike.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${
                      bike.purpose === 'sale' 
                        ? 'bg-blue-600' 
                        : bike.purpose === 'rent' 
                        ? 'bg-green-600' 
                        : 'bg-purple-600'
                    }`}>
                      {bike.purpose === 'sale' ? 'For Sale' : bike.purpose === 'rent' ? 'For Rent' : 'Sale/Rent'}
                    </span>
                  </div>
                </div>
                <div onClick={() => navigate(`/bikes/${bike._id}`)} className="cursor-pointer">
                  <h2 className="text-xl font-semibold mb-2">{bike.title}</h2>
                  <p className="text-gray-600 mb-2">
                    {bike.brand} {bike.bikeModel} ({bike.year})
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold">
                      {bike.pricing.salePrice
                        ? `₹${bike.pricing.salePrice}`
                        : `₹${bike.pricing.rentalPrice?.daily}/day`}
                    </span>
                    <span className="text-sm text-gray-500">{bike.location.city}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openEditDialog(bike)}
                  className="flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => openDeleteDialog(bike)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add Bike Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Bike</DialogTitle>
            <DialogDescription>
              Fill in the details for your new bike listing.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a descriptive title"
                />
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g., Honda, Yamaha"
                />
              </div>
              <div>
                <Label htmlFor="bikeModel">Model</Label>
                <Input
                  id="bikeModel"
                  name="bikeModel"
                  value={formData.bikeModel}
                  onChange={handleInputChange}
                  placeholder="e.g., CBR 250R"
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="e.g., 2022"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="cruiser">Cruiser</SelectItem>
                    <SelectItem value="vintage">Vintage</SelectItem>
                    <SelectItem value="scooter">Scooter</SelectItem>
                    <SelectItem value="commuter">Commuter</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your bike"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="purpose">Purpose</Label>
                <Select 
                  value={formData.purpose} 
                  onValueChange={(value) => setFormData({...formData, purpose: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="both">Both Sale & Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(formData.purpose === 'sale' || formData.purpose === 'both') && (
                <div>
                  <Label htmlFor="salePrice">Sale Price (₹)</Label>
                  <Input
                    id="salePrice"
                    name="pricing.salePrice"
                    value={formData.pricing.salePrice}
                    onChange={handleInputChange}
                    placeholder="e.g., 150000"
                    type="number"
                  />
                </div>
              )}
              
              {(formData.purpose === 'rent' || formData.purpose === 'both') && (
                <>
                  <div className="col-span-2">
                    <Label>Rental Prices</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <Label htmlFor="dailyPrice">Daily (₹)</Label>
                        <Input
                          id="dailyPrice"
                          value={formData.pricing.rentalPrice.daily}
                          onChange={(e) => handleRentalPriceChange(e, 'daily')}
                          placeholder="e.g., 1500"
                          type="number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="weeklyPrice">Weekly (₹)</Label>
                        <Input
                          id="weeklyPrice"
                          value={formData.pricing.rentalPrice.weekly}
                          onChange={(e) => handleRentalPriceChange(e, 'weekly')}
                          placeholder="e.g., 7500"
                          type="number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="monthlyPrice">Monthly (₹)</Label>
                        <Input
                          id="monthlyPrice"
                          value={formData.pricing.rentalPrice.monthly}
                          onChange={(e) => handleRentalPriceChange(e, 'monthly')}
                          placeholder="e.g., 25000"
                          type="number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hourlyPrice">Hourly (₹)</Label>
                        <Input
                          id="hourlyPrice"
                          value={formData.pricing.rentalPrice.hourly}
                          onChange={(e) => handleRentalPriceChange(e, 'hourly')}
                          placeholder="e.g., 200"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <div>
                <Label htmlFor="engineCC">Engine (CC)</Label>
                <Input
                  id="engineCC"
                  name="specifications.engineCC"
                  value={formData.specifications.engineCC}
                  onChange={(e) => handleNestedInputChange(e, 'specifications', 'engineCC')}
                  placeholder="e.g., 250"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="mileage">Mileage (KMPL)</Label>
                <Input
                  id="mileage"
                  name="specifications.mileage"
                  value={formData.specifications.mileage}
                  onChange={(e) => handleNestedInputChange(e, 'specifications', 'mileage')}
                  placeholder="e.g., 35"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select 
                  value={formData.specifications.condition} 
                  onValueChange={(value) => setFormData({
                    ...formData, 
                    specifications: {
                      ...formData.specifications,
                      condition: value
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="location.city"
                  value={formData.location.city}
                  onChange={(e) => handleNestedInputChange(e, 'location', 'city')}
                  placeholder="e.g., Mumbai"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="location.state"
                  value={formData.location.state}
                  onChange={(e) => handleNestedInputChange(e, 'location', 'state')}
                  placeholder="e.g., Maharashtra"
                />
              </div>
              <div className="col-span-2">
                <Label>Location Details</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="location.address"
                      value={formData.location.address}
                      onChange={(e) => handleNestedInputChange(e, 'location', 'address')}
                      placeholder="Full address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.location.coordinates.latitude}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: {
                          ...prev.location,
                          coordinates: {
                            ...prev.location.coordinates,
                            latitude: e.target.value
                          }
                        }
                      }))}
                      placeholder="e.g., 19.0760"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.location.coordinates.longitude}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: {
                          ...prev.location,
                          coordinates: {
                            ...prev.location.coordinates,
                            longitude: e.target.value
                          }
                        }
                      }))}
                      placeholder="e.g., 72.8777"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="maintenance">Under Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="images">Image URL</Label>
                <Input
                  id="images"
                  value={formData.images[0]}
                  onChange={(e) => setFormData({
                    ...formData,
                    images: [e.target.value, ...formData.images.slice(1)]
                  })}
                  placeholder="Enter image URL"
                />
                <div className="text-xs text-gray-500 mt-1">
                  For multiple images, add them after creating the bike listing.
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddBike}>Add Bike</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Bike Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Bike</DialogTitle>
            <DialogDescription>
              Update the details for your bike listing.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Same form fields as Add Bike Dialog */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="edit-brand">Brand</Label>
                <Input
                  id="edit-brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="edit-bikeModel">Model</Label>
                <Input
                  id="edit-bikeModel"
                  name="bikeModel"
                  value={formData.bikeModel}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="edit-year">Year</Label>
                <Input
                  id="edit-year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="cruiser">Cruiser</SelectItem>
                    <SelectItem value="vintage">Vintage</SelectItem>
                    <SelectItem value="scooter">Scooter</SelectItem>
                    <SelectItem value="commuter">Commuter</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              {/* Other fields as in Add Dialog */}
              <div>
                <Label htmlFor="edit-purpose">Purpose</Label>
                <Select 
                  value={formData.purpose} 
                  onValueChange={(value) => setFormData({...formData, purpose: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="both">Both Sale & Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(formData.purpose === 'sale' || formData.purpose === 'both') && (
                <div>
                  <Label htmlFor="edit-salePrice">Sale Price (₹)</Label>
                  <Input
                    id="edit-salePrice"
                    name="pricing.salePrice"
                    value={formData.pricing.salePrice}
                    onChange={handleInputChange}
                    type="number"
                  />
                </div>
              )}
              
              {(formData.purpose === 'rent' || formData.purpose === 'both') && (
                <>
                  <div className="col-span-2">
                    <Label>Rental Prices</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <Label htmlFor="edit-dailyPrice">Daily (₹)</Label>
                        <Input
                          id="edit-dailyPrice"
                          value={formData.pricing.rentalPrice.daily}
                          onChange={(e) => handleRentalPriceChange(e, 'daily')}
                          type="number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-weeklyPrice">Weekly (₹)</Label>
                        <Input
                          id="edit-weeklyPrice"
                          value={formData.pricing.rentalPrice.weekly}
                          onChange={(e) => handleRentalPriceChange(e, 'weekly')}
                          type="number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-monthlyPrice">Monthly (₹)</Label>
                        <Input
                          id="edit-monthlyPrice"
                          value={formData.pricing.rentalPrice.monthly}
                          onChange={(e) => handleRentalPriceChange(e, 'monthly')}
                          type="number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-hourlyPrice">Hourly (₹)</Label>
                        <Input
                          id="edit-hourlyPrice"
                          value={formData.pricing.rentalPrice.hourly}
                          onChange={(e) => handleRentalPriceChange(e, 'hourly')}
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <div>
                <Label htmlFor="edit-engineCC">Engine (CC)</Label>
                <Input
                  id="edit-engineCC"
                  value={formData.specifications.engineCC}
                  onChange={(e) => handleNestedInputChange(e, 'specifications', 'engineCC')}
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="edit-mileage">Mileage (KMPL)</Label>
                <Input
                  id="edit-mileage"
                  value={formData.specifications.mileage}
                  onChange={(e) => handleNestedInputChange(e, 'specifications', 'mileage')}
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="edit-condition">Condition</Label>
                <Select 
                  value={formData.specifications.condition} 
                  onValueChange={(value) => setFormData({
                    ...formData, 
                    specifications: {
                      ...formData.specifications,
                      condition: value
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={formData.location.city}
                  onChange={(e) => handleNestedInputChange(e, 'location', 'city')}
                />
              </div>
              <div>
                <Label htmlFor="edit-state">State</Label>
                <Input
                  id="edit-state"
                  value={formData.location.state}
                  onChange={(e) => handleNestedInputChange(e, 'location', 'state')}
                />
              </div>
              <div className="col-span-2">
                <Label>Location Details</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="col-span-2">
                    <Label htmlFor="edit-address">Address</Label>
                    <Input
                      id="edit-address"
                      name="location.address"
                      value={formData.location.address}
                      onChange={(e) => handleNestedInputChange(e, 'location', 'address')}
                      placeholder="Full address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-latitude">Latitude</Label>
                    <Input
                      id="edit-latitude"
                      type="number"
                      step="any"
                      value={formData.location.coordinates.latitude}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: {
                          ...prev.location,
                          coordinates: {
                            ...prev.location.coordinates,
                            latitude: e.target.value
                          }
                        }
                      }))}
                      placeholder="e.g., 19.0760"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-longitude">Longitude</Label>
                    <Input
                      id="edit-longitude"
                      type="number"
                      step="any"
                      value={formData.location.coordinates.longitude}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: {
                          ...prev.location,
                          coordinates: {
                            ...prev.location.coordinates,
                            longitude: e.target.value
                          }
                        }
                      }))}
                      placeholder="e.g., 72.8777"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="maintenance">Under Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-images">Image URL</Label>
                <Input
                  id="edit-images"
                  value={formData.images[0]}
                  onChange={(e) => setFormData({
                    ...formData,
                    images: [e.target.value, ...formData.images.slice(1)]
                  })}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateBike}>Update Bike</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Bike</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this bike? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteBike}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyBikesPage;
