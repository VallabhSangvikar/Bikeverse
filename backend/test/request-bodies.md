# API Test Request Bodies

## User Model

### Create Buyer
```json
{
  "email": "buyer@example.com",
  "password": "Password123!",
  "role": "buyer",
  "name": "John Doe",
  "phone": "1234567890"
}
```

### Create Seller
```json
{
  "email": "seller@example.com",
  "password": "Password123!",
  "role": "seller",
  "name": "Jane Smith",
  "phone": "9876543210",
  "businessType": "showroom",
  "address": {
    "street": "123 Business Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "coordinates": {
      "latitude": 19.0760,
      "longitude": 72.8777
    }
  },
  "documents": {
    "idProof": "id-proof-file-url",
    "businessLicense": "license-file-url"
  }
}
```

## Bike Model

### Create Bike Listing
```json
{
  "title": "2022 Royal Enfield Classic 350",
  "brand": "Royal Enfield",
  "bikeModel": "Classic 350",
  "year": 2022,
  "category": "cruiser",
  "description": "Well-maintained Classic 350 with all original parts",
  "images": ["image1-url", "image2-url"],
  "purpose": "both",
  "pricing": {
    "salePrice": 180000,
    "rentalPrice": {
      "hourly": 200,
      "daily": 1000,
      "weekly": 5000,
      "monthly": 15000
    }
  },
  "specifications": {
    "engineCC": 350,
    "mileage": 35,
    "condition": "used"
  },
  "location": {
    "address": "456 Bike Street",
    "city": "Bangalore",
    "state": "Karnataka",
    "coordinates": {
      "latitude": 12.9716,
      "longitude": 77.5946
    }
  },
  "documents": {
    "registration": "registration-doc-url",
    "insurance": "insurance-doc-url"
  }
}
```

## Booking Model

### Create Purchase Booking
```json
{
  "bike": "bikeId",
  "seller": "sellerId",
  "type": "purchase",
  "message": "I'm interested in buying this bike",
  "price": 180000
}
```

### Create Rental Booking
```json
{
  "bike": "bikeId",
  "seller": "sellerId",
  "type": "rental",
  "rentalDuration": {
    "startDate": "2024-02-01T10:00:00Z",
    "endDate": "2024-02-07T10:00:00Z"
  },
  "message": "I'd like to rent this bike for a week",
  "price": 5000
}
```

## Review Model

### Create Review
```json
{
  "seller": "sellerId",
  "bike": "bikeId",
  "rating": 5,
  "comment": "Great experience! The bike was in excellent condition.",
  "transactionType": "purchase"
}
```

## Testing Notes

- Replace `bikeId`, `sellerId` with actual MongoDB ObjectIds
- The URLs for documents and images should be replaced with actual URLs after file upload
- All dates should be in ISO 8601 format
- Ensure all required fields are included based on the models
- For updating records, you can use the same structure but only include the fields you want to update
