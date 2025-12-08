import bag from './bag.jpeg';
import care from './care.jpeg';
import jwellery from './jwellery.jpeg';

import notebook from './notebook.jpeg';
import pillow from './pillow.jpeg';
import tshirt from './tshirt.jpeg';


export const featured = [
    {
        _id: "aaaaa",
        name: "Casual Travel Bag",
        description: "A durable and spacious bag suitable for weekend trips and daily commutes.",
        price: 450,
        image: [bag],
        category: "Accessories",
        subCategory: "Bags",
        sizes: ["One Size"],
        date: 1716634345448,
        bestseller: true
    },
    
   
    {
        _id: "aaaad",
        name: "Cotton Round Neck T-Shirt",
        description: "Soft and breathable cotton t-shirt available in various colors.",
        price: 250,
        image: [tshirt],
        category: "Men",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL"],
        date: 1716634345451,
        bestseller: true
    },
    
   
    {
        _id: "aaaag",
        name: "Comfort Pillow",
        description: "Soft pillow designed for maximum comfort and support.",
        price: 720,
        image: [pillow],
        category: "Home",
        subCategory: "Bedroom",
        sizes: ["Standard"],
        date: 1716634345454,
        bestseller: true
    },
    {
        _id: "aaaah",
        name: "Spiral Notebook",
        description: "High-quality paper notebook for journaling and note-taking.",
        price: 200,
        image: [notebook],
        category: "Stationery",
        subCategory: "Office",
        sizes: ["A5", "A4"],
        date: 1716634345455,
        bestseller: false
    },
    {
        _id: "aaaai",
        name: "Jewellery Box",
        description: "Compact box to keep your precious items organized and safe.",
        price: 350,
        image: [jwellery],
        category: "Accessories",
        subCategory: "Storage",
        sizes: ["One Size"],
        date: 1716634345456,
        bestseller: false
    },
    {
        _id: "aaaaj",
        name: "Skin Care Kit",
        description: "Complete skin care set for daily rejuvenation and hydration.",
        price: 600,
        image: [care],
        category: "Beauty",
        subCategory: "Skincare",
        sizes: ["Kit"],
        date: 1716634345457,
        bestseller: true
    }
];