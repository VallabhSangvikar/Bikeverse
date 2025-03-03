import mongoose from "mongoose";
import dotenv from "dotenv";
import { Bike } from "./models/bike.model"; // Update the path if needed

dotenv.config();

const bikes = [
  {
    title: "Yamaha R15 V4",
    brand: "Yamaha",
    bikeModel: "R15 V4",
    year: 2023,
    category: "sports",
    description: "A sleek and powerful sports bike designed for speed enthusiasts.",
    images: [
      "https://imgd.aeplcdn.com/664x374/n/cw/ec/115871/mt-15-v2-right-front-three-quarter-3.jpeg?isig=0&q=80"
    ],
    purpose: "sale",
    pricing: {
      salePrice: 180000
    },
    specifications: {
      engineCC: 155,
      mileage: 45,
      condition: "new"
    },
    seller: "60f7e1b8c2d59a0015e3c123",
    location: {
      address: "Sector 17",
      city: "Pune",
      state: "Maharashtra",
      coordinates: {
        latitude: 18.5204,
        longitude: 73.8567
      }
    },
    status: "available"
  },
  {
    title: "Royal Enfield Classic 350",
    brand: "Royal Enfield",
    bikeModel: "Classic 350",
    year: 2021,
    category: "cruiser",
    description: "A legendary cruiser bike with a retro design and powerful performance.",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREXKgzXuhKy28WYxMN9wtCpd-QPDtZ5-ZUkQ&s"
    ],
    purpose: "both",
    pricing: {
      salePrice: 210000,
      rentalPrice: {
        hourly: 300,
        daily: 1500,
        weekly: 9000,
        monthly: 25000
      }
    },
    specifications: {
      engineCC: 349,
      mileage: 35,
      condition: "used"
    },
    seller: "60f7e1b8c2d59a0015e3c124",
    location: {
      address: "MG Road",
      city: "Bangalore",
      state: "Karnataka",
      coordinates: {
        latitude: 12.9716,
        longitude: 77.5946
      }
    },
    status: "available"
  },
  {
    title: "Honda Activa 6G",
    brand: "Honda",
    bikeModel: "Activa 6G",
    year: 2022,
    category: "scooter",
    description: "A reliable and fuel-efficient scooter perfect for daily commuting.",
    images: [
      "https://imgd.aeplcdn.com/1280x720/n/cw/ec/44686/activa-6g-right-front-three-quarter.jpeg"
    ],
    purpose: "rent",
    pricing: {
      rentalPrice: {
        hourly: 100,
        daily: 500,
        weekly: 3000,
        monthly: 9000
      }
    },
    specifications: {
      engineCC: 110,
      mileage: 50,
      condition: "new"
    },
    seller: "60f7e1b8c2d59a0015e3c125",
    location: {
      address: "Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      coordinates: {
        latitude: 28.6353,
        longitude: 77.2250
      }
    },
    status: "available"
  },
  {
    title: "KTM Duke 390",
    brand: "KTM",
    bikeModel: "Duke 390",
    year: 2020,
    category: "sports",
    description: "A high-performance naked street bike with advanced features.",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCRCCTMGwS-rNnTvUgBlEluCyBaYUkItXklw&s"
    ],
    purpose: "both",
    pricing: {
      salePrice: 280000,
      rentalPrice: {
        hourly: 500,
        daily: 2500,
        weekly: 14000,
        monthly: 40000
      }
    },
    specifications: {
      engineCC: 373,
      mileage: 30,
      condition: "used"
    },
    seller: "60f7e1b8c2d59a0015e3c126",
    location: {
      address: "Andheri West",
      city: "Mumbai",
      state: "Maharashtra",
      coordinates: {
        latitude: 19.1298,
        longitude: 72.8496
      }
    },
    status: "available"
  },
  {
    title: "BMW G 310 GS",
    brand: "BMW",
    bikeModel: "G 310 GS",
    year: 2023,
    category: "adventure",
    description: "A premium adventure touring bike for all terrains.",
    images: [
      "https://cdn.bikedekho.com/processedimages/bmw/g-310-gs/494X300/g-310-gs675006dc51ebf.jpg?imwidth=480&impolicy=resize"
    ],
    purpose: "sale",
    pricing: {
      salePrice: 350000
    },
    specifications: {
      engineCC: 313,
      mileage: 28,
      condition: "new"
    },
    seller: "60f7e1b8c2d59a0015e3c127",
    location: {
      address: "Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      coordinates: {
        latitude: 17.3850,
        longitude: 78.4867
      }
    },
    status: "available"
  },
  {
    title: "Bajaj Pulsar NS200",
    brand: "Bajaj",
    bikeModel: "Pulsar NS200",
    year: 2022,
    category: "street",
    description: "A powerful street bike with aggressive styling and sporty performance.",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbQAU7WkK5PndOrCp72roQd9GIaIZzlnPdkw&s"
    ],
    purpose: "both",
    pricing: {
      salePrice: 140000,
      rentalPrice: {
        hourly: 200,
        daily: 1000,
        weekly: 6000,
        monthly: 18000
      }
    },
    specifications: {
      engineCC: 199,
      mileage: 40,
      condition: "used"
    },
    seller: "60f7e1b8c2d59a0015e3c128",
    location: {
      address: "Kothrud",
      city: "Pune",
      state: "Maharashtra",
      coordinates: {
        latitude: 18.5074,
        longitude: 73.8077
      }
    },
    status: "available"
  },
  {
    title: "TVS Apache RTR 160",
    brand: "TVS",
    bikeModel: "Apache RTR 160",
    year: 2021,
    category: "street",
    description: "A nimble and stylish street bike with race-tuned performance.",
    images: [
      "https://imgd.aeplcdn.com/664x374/n/cw/ec/1/versions/--single-disc-abs-black-edition1718957076245.jpg?q=80"
    ],
    purpose: "sale",
    pricing: {
      salePrice: 120000
    },
    specifications: {
      engineCC: 160,
      mileage: 45,
      condition: "used"
    },
    seller: "60f7e1b8c2d59a0015e3c129",
    location: {
      address: "Indiranagar",
      city: "Bangalore",
      state: "Karnataka",
      coordinates: {
        latitude: 12.9719,
        longitude: 77.6412
      }
    },
    status: "available"
  },
  {
    title: "Hero Splendor Plus",
    brand: "Hero",
    bikeModel: "Splendor Plus",
    year: 2023,
    category: "commuter",
    description: "A reliable and fuel-efficient commuter bike perfect for daily use.",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgr6URfirqDEceYYw_x0dCeoybR8dMy3Kf0A&s"
    ],
    purpose: "rent",
    pricing: {
      rentalPrice: {
        hourly: 80,
        daily: 400,
        weekly: 2500,
        monthly: 7500
      }
    },
    specifications: {
      engineCC: 97,
      mileage: 60,
      condition: "new"
    },
    seller: "60f7e1b8c2d59a0015e3c130",
    location: {
      address: "Karol Bagh",
      city: "New Delhi",
      state: "Delhi",
      coordinates: {
        latitude: 28.6519,
        longitude: 77.1913
      }
    },
    status: "available"
  },
  {
    title: "Suzuki Gixxer SF 250",
    brand: "Suzuki",
    bikeModel: "Gixxer SF 250",
    year: 2022,
    category: "sports",
    description: "A stylish and aerodynamic sports bike with great handling and performance.",
    images: [
      "https://5.imimg.com/data5/SELLER/Default/2024/8/445170356/TJ/KK/IP/16402/suzuki-gixxer-sf-250-motorcycle.png"
    ],
    purpose: "both",
    pricing: {
      salePrice: 190000,
      rentalPrice: {
        hourly: 350,
        daily: 1800,
        weekly: 10000,
        monthly: 28000
      }
    },
    specifications: {
      engineCC: 249,
      mileage: 38,
      condition: "new"
    },
    seller: "60f7e1b8c2d59a0015e3c131",
    location: {
      address: "Bandra",
      city: "Mumbai",
      state: "Maharashtra",
      coordinates: {
        latitude: 19.0595,
        longitude: 72.8297
      }
    },
    status: "available"
  },
  {
    title: "Ducati Scrambler 800",
    brand: "Ducati",
    bikeModel: "Scrambler 800",
    year: 2021,
    category: "scrambler",
    description: "A high-performance scrambler with a retro-modern design.",
    images: [
      "https://images.news18.com/ibnlive/uploads/2019/04/Ducati-Scrambler-Full-Throttle.jpg"
    ],
    purpose: "sale",
    pricing: {
      salePrice: 870000
    },
    specifications: {
      engineCC: 803,
      mileage: 20,
      condition: "used"
    },
    seller: "60f7e1b8c2d59a0015e3c132",
    location: {
      address: "Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      coordinates: {
        latitude: 17.4239,
        longitude: 78.4295
      }
    },
    status: "available"
  },
  {
    title: "Suzuki Hayabusa",
    brand: "Suzuki",
    bikeModel: "Hayabusa",
    year: 2022,
    category: "sports",
    description: "A legendary superbike known for its high speed and smooth performance.",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFiJ2Qwge5qDGIx67T5l1uHFS28SQRr7Sj_Q&s"
    ],
    purpose: "sale",
    pricing: {
      salePrice: 1650000
    },
    specifications: {
      engineCC: 1340,
      mileage: 17,
      condition: "new"
    },
    seller: "60f7e1b8c2d59a0015e3c128",
    location: {
      address: "Marine Drive",
      city: "Mumbai",
      state: "Maharashtra",
      coordinates: {
        latitude: 18.9440,
        longitude: 72.8206
      }
    },
    status: "available"
  },
  {
    title: "Bajaj Pulsar NS200",
    brand: "Bajaj",
    bikeModel: "Pulsar NS200",
    year: 2021,
    category: "naked",
    description: "A powerful and stylish street bike with excellent performance.",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREXNz3VAJqpFAJXZeoJRTiAZAWIsmB7Jswkg&s"
    ],
    purpose: "both",
    pricing: {
      salePrice: 140000,
      rentalPrice: {
        hourly: 200,
        daily: 1000,
        weekly: 6000,
        monthly: 18000
      }
    },
    specifications: {
      engineCC: 199,
      mileage: 36,
      condition: "used"
    },
    seller: "60f7e1b8c2d59a0015e3c129",
    location: {
      address: "Koregaon Park",
      city: "Pune",
      state: "Maharashtra",
      coordinates: {
        latitude: 18.5370,
        longitude: 73.8995
      }
    },
    status: "available"
  },
  {
    title: "Harley-Davidson Street 750",
    brand: "Harley-Davidson",
    bikeModel: "Street 750",
    year: 2020,
    category: "cruiser",
    description: "A stylish and comfortable cruiser for long rides.",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9SunDBKKxFsJbUAlJNV83WMf7-s3sjs8iDA&s"
    ],
    purpose: "sale",
    pricing: {
      salePrice: 480000
    },
    specifications: {
      engineCC: 749,
      mileage: 20,
      condition: "used"
    },
    seller: "60f7e1b8c2d59a0015e3c130",
    location: {
      address: "JP Nagar",
      city: "Bangalore",
      state: "Karnataka",
      coordinates: {
        latitude: 12.9081,
        longitude: 77.5855
      }
    },
    status: "available"
  },
  {
    title: "Kawasaki Ninja 650",
    brand: "Kawasaki",
    bikeModel: "Ninja 650",
    year: 2023,
    category: "sports",
    description: "A mid-range sports bike with superb handling and power.",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoWqsgBMMBYi7fFNN6N4XZEEo9QlyZ3leTuA&s"
    ],
    purpose: "sale",
    pricing: {
      salePrice: 720000
    },
    specifications: {
      engineCC: 649,
      mileage: 22,
      condition: "new"
    },
    seller: "60f7e1b8c2d59a0015e3c131",
    location: {
      address: "Indiranagar",
      city: "Bangalore",
      state: "Karnataka",
      coordinates: {
        latitude: 12.9784,
        longitude: 77.6408
      }
    },
    status: "available"
  },
  {
    title: "TVS Apache RTR 160",
    brand: "TVS",
    bikeModel: "Apache RTR 160",
    year: 2021,
    category: "street",
    description: "A reliable and fuel-efficient commuter bike with sporty looks.",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_LGaP0NvEL9XC-GePAShqJOcQY2-9ewOQMQ&s"
    ],
    purpose: "rent",
    pricing: {
      rentalPrice: {
        hourly: 150,
        daily: 800,
        weekly: 4500,
        monthly: 12000
      }
    },
    specifications: {
      engineCC: 159,
      mileage: 45,
      condition: "used"
    },
    seller: "60f7e1b8c2d59a0015e3c132",
    location: {
      address: "Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      coordinates: {
        latitude: 28.6353,
        longitude: 77.2250
      }
    },
    status: "available"
  },
  {
    title: "Ducati Panigale V4",
    brand: "Ducati",
    bikeModel: "Panigale V4",
    year: 2023,
    category: "sports",
    description: "A high-end Italian sports bike known for its speed and precision.",
    images: [
      "https://imgd.aeplcdn.com/664x374/n/bw/models/colors/ducati-select-model-carbon-1637224589680.jpeg?q=80"
    ],
    purpose: "sale",
    pricing: {
      salePrice: 2300000
    },
    specifications: {
      engineCC: 1103,
      mileage: 15,
      condition: "new"
    },
    seller: "60f7e1b8c2d59a0015e3c133",
    location: {
      address: "Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      coordinates: {
        latitude: 17.4274,
        longitude: 78.4489
      }
    },
    status: "available"
  },
  {
    title: "Hero Splendor Plus",
    brand: "Hero",
    bikeModel: "Splendor Plus",
    year: 2022,
    category: "commuter",
    description: "A fuel-efficient and affordable commuter bike.",
    images: [
      "https://cdn.bikedekho.com/processedimages/hero/splendor-plus-xtec/source/splendor-plus-xtec665968736dd79.jpg"
    ],
    purpose: "both",
    pricing: {
      salePrice: 75000,
      rentalPrice: {
        hourly: 80,
        daily: 400,
        weekly: 2500,
        monthly: 7000
      }
    },
    specifications: {
      engineCC: 97,
      mileage: 60,
      condition: "new"
    },
    seller: "60f7e1b8c2d59a0015e3c134",
    location: {
      address: "Chandni Chowk",
      city: "Delhi",
      state: "Delhi",
      coordinates: {
        latitude: 28.6565,
        longitude: 77.2316
      }
    },
    status: "available"
  }

]
;

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bikeverse");
    console.log("Connected to MongoDB");

    await Bike.deleteMany({});
    console.log("Existing bikes deleted");

    await Bike.insertMany(bikes);
    console.log("Bikes inserted successfully");

    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();
