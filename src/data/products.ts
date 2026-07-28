// import { Products } from "@/types/products";

// export const products: Products[] = [
//     {
//         id: 1,
//         name: "Glow Serum",
//         description: "Premium Skincare",
//         price: 89,
//         rating: 4.8,
//         image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
//         images: 
//         [
//             "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
//             "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
//             "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
//         ],
//         features: 
//         [
//             "Premium quanlity ingredients",
//             "Suitable for daily use",
//             "Dermatologically tested",
//         ],
//         isNew: true,
//         category: "Skincare",
//     },
//     {
//         id: 2,
//         name: "Vitamin C Serum",
//         description: "Brightening Essence",
//         price: 45,
//         rating: 4.7,
//         image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
//         images: 
//         [
//             "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
//             "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
//             "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
//         ],
//         features: 
//         [
//             "Premium quanlity ingredients",
//             "Suitable for daily use",
//             "Dermatologically tested",
//         ],
//         isNew: false,
//         category: "Beauty",
//     },
//     {
//         id: 3,
//         name: "Hydrating Face Cream",
//         description: "Deep Moisture Formula",
//         price: 185,
//         rating: 4.9,
//         image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
//         images: 
//         [
//             "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
//             "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
//             "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
//         ],
//         features: 
//         [
//             "Premium quanlity ingredients",
//             "Suitable for daily use",
//             "Dermatologically tested",
//         ],
//         isNew: true,
//         category: "Hair",
//     },
// ];

import { Products } from "@/types/products";

export const products: Products[] = [
  {
    id: 1,
    name: "Glow Serum",
    description: "Premium Hydrating Serum",
    price: 89,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
    ],
    features: [
      "Premium quality ingredients",
      "Suitable for daily use",
      "Deep hydration & nourishment",
    ],
    isNew: true,
    category: "Skincare",
  },

  {
    id: 2,
    name: "Vitamin C Serum",
    description: "Brightening Facial Essence",
    price: 45,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
    ],
    features: [
      "Rich in Vitamin C",
      "Improves skin radiance",
      "Lightweight & non-greasy",
    ],
    isNew: false,
    category: "Skincare",
  },

  {
    id: 3,
    name: "Hydrating Face Cream",
    description: "Deep Moisture Formula",
    price: 185,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
    images: [
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
    ],
    features: [
      "24-hour hydration",
      "Soft & smooth finish",
      "Dermatologically tested",
    ],
    isNew: true,
    category: "Skincare",
  },

  {
    id: 4,
    name: "Gentle Facial Cleanser",
    description: "Daily Refresh Cleanser",
    price: 39,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24",
    images: [
      "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24",
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
    ],
    features: [
      "Removes dirt & oil",
      "Gentle on sensitive skin",
      "Soap-free formula",
    ],
    isNew: false,
    category: "Skincare",
  },

  {
    id: 5,
    name: "Repair Shampoo",
    description: "Strengthening Hair Care",
    price: 59,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
    ],
    features: [
      "Repairs damaged hair",
      "Adds natural shine",
      "Suitable for all hair types",
    ],
    isNew: false,
    category: "Hair",
  },

  {
    id: 6,
    name: "Hair Treatment Oil",
    description: "Nourishing Hair Serum",
    price: 75,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273",
    images: [
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
    ],
    features: [
      "Controls frizz",
      "Lightweight argan oil",
      "Adds silky smooth finish",
    ],
    isNew: true,
    category: "Hair",
  },
    {
    id: 7,
    name: "Matte Lipstick",
    description: "Long-lasting Velvet Finish",
    price: 29,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796",
    ],
    features: [
      "Long-lasting formula",
      "Smooth velvet finish",
      "Highly pigmented",
    ],
    isNew: false,
    category: "Makeup",
  },

  {
    id: 8,
    name: "Cushion Foundation",
    description: "Lightweight Natural Coverage",
    price: 65,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796",
    ],
    features: [
      "Buildable coverage",
      "SPF protection",
      "Natural glowing finish",
    ],
    isNew: true,
    category: "Makeup",
  },

  {
    id: 9,
    name: "Body Lotion",
    description: "Moisturizing Daily Care",
    price: 42,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc",
    images: [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
    ],
    features: [
      "Deep moisturizing",
      "Fast absorbing",
      "Suitable for all skin types",
    ],
    isNew: false,
    category: "Body Care",
  },

  {
    id: 10,
    name: "Coffee Body Scrub",
    description: "Exfoliating Body Polish",
    price: 49,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a",
    images: [
      "https://images.unsplash.com/photo-1612817288484-6f916006741a",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
    ],
    features: [
      "Natural coffee extract",
      "Removes dead skin cells",
      "Leaves skin soft & smooth",
    ],
    isNew: true,
    category: "Body Care",
  },

  {
    id: 11,
    name: "Floral Perfume",
    description: "Elegant Everyday Fragrance",
    price: 95,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
    ],
    features: [
      "Long-lasting scent",
      "Fresh floral notes",
      "Elegant glass bottle",
    ],
    isNew: false,
    category: "Beauty",
  },

  {
    id: 12,
    name: "Makeup Brush Set",
    description: "Professional Beauty Tools",
    price: 55,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796",
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
    ],
    features: [
      "Ultra-soft synthetic bristles",
      "Professional quality",
      "Perfect for daily makeup",
    ],
    isNew: true,
    category: "Beauty",
  },
];