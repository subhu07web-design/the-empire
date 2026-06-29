import { MenuItem } from "../types";

export const INITIAL_MENU: MenuItem[] = [
  // Starters
  {
    id: "s1",
    name: "Crispy Spring Rolls",
    description: "Golden fried vegetable rolls served with our signature sweet and sour chili dipping sauce.",
    price: 180,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60",
    rating: 4.6,
    isVegetarian: true,
    isPopular: true,
    prepTime: "10-15 min"
  },
  {
    id: "s2",
    name: "Empire Special Chicken Tikka",
    description: "Succulent boneless chicken chunks marinated in yogurt, garlic, ginger, and rich spices, grilled in tandoor.",
    price: 320,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    isVegetarian: false,
    isPopular: true,
    prepTime: "15-20 min"
  },
  {
    id: "s3",
    name: "Paneer Malai Tikka",
    description: "Fresh cottage cheese cubes marinated in cream, cashew paste, and mild spices, roasted to perfection.",
    price: 280,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    isVegetarian: true,
    isPopular: false,
    prepTime: "15-18 min"
  },

  // Main Course
  {
    id: "m1",
    name: "Imperial Butter Chicken",
    description: "Tandoori chicken pieces simmered in a velvety tomato-butter gravy, enriched with fresh cream and dried fenugreek.",
    price: 380,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    isVegetarian: false,
    isPopular: true,
    prepTime: "20-25 min"
  },
  {
    id: "m2",
    name: "Dal Bukhara",
    description: "Slow-cooked black lentils cooked overnight with tomatoes, cream, and ghee, representing the true taste of Punjab.",
    price: 290,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    isVegetarian: true,
    isPopular: true,
    prepTime: "15-20 min"
  },
  {
    id: "m3",
    name: "Hyderabadi Dum Biryani (Chicken)",
    description: "Layers of premium long-grain basmati rice and marinated chicken cooked on 'dum' with saffron, mint, and pure ghee.",
    price: 420,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    isVegetarian: false,
    isPopular: true,
    prepTime: "22-28 min"
  },
  {
    id: "m4",
    name: "Shahi Kadhai Paneer",
    description: "Paneer cubes tossed with bell peppers and tomatoes in a freshly ground kadhai masala blend.",
    price: 310,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=60",
    rating: 4.5,
    isVegetarian: true,
    isPopular: false,
    prepTime: "15-20 min"
  },

  // Desserts
  {
    id: "d1",
    name: "Saffron Shahi Tukda",
    description: "Rich bread pudding infused with cardamom, saffron-scented rabri, topped with silver leaf and roasted almonds.",
    price: 190,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    isVegetarian: true,
    isPopular: true,
    prepTime: "10-12 min"
  },
  {
    id: "d2",
    name: "Warm Gulab Jamun with Ice Cream",
    description: "Traditional deep-fried milk dumplings soaked in cardamom sugar syrup, served with creamy vanilla bean ice cream.",
    price: 150,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    isVegetarian: true,
    isPopular: false,
    prepTime: "5-7 min"
  },

  // Drinks
  {
    id: "dr1",
    name: "Royal Mango Lassi",
    description: "Thick, creamy yogurt drink blended with sweet Alphonso mango pulp and garnished with pistachios.",
    price: 120,
    category: "Drinks & Mocktails",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    isVegetarian: true,
    isPopular: true,
    prepTime: "5 min"
  },
  {
    id: "dr2",
    name: "Empire Mint Mojito",
    description: "Refreshing cooler made with fresh mint leaves, lime chunks, cane sugar, and club soda over crushed ice.",
    price: 140,
    category: "Drinks & Mocktails",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=60",
    rating: 4.6,
    isVegetarian: true,
    isPopular: false,
    prepTime: "5 min"
  },
  {
    id: "s4",
    name: "Tandoori Soya Chaap",
    description: "Juicy soya chaap marinated in yogurt and tandoori spices, smoked to perfection in our clay oven.",
    price: 220,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=600&auto=format&fit=crop&q=60",
    rating: 4.6,
    isVegetarian: true,
    isPopular: false,
    prepTime: "12-15 min"
  },
  {
    id: "m5",
    name: "Kashmiri Mutton Rogan Josh",
    description: "Tender chunks of mutton slow-cooked in a rich gravy flavored with Kashmiri chilies, ginger, and aromatic spices.",
    price: 460,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1545247181-516773cae71d?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    isVegetarian: false,
    isPopular: true,
    prepTime: "25-30 min"
  },
  {
    id: "m6",
    name: "Paneer Butter Masala",
    description: "Soft cottage cheese cubes cooked in a sweet, mild, and creamy tomato butter gravy.",
    price: 320,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    isVegetarian: true,
    isPopular: true,
    prepTime: "15-18 min"
  },
  {
    id: "m7",
    name: "Garlic Butter Naan",
    description: "Traditional leavened flatbread brushed with minced garlic and premium butter, baked fresh in tandoor.",
    price: 60,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    isVegetarian: true,
    isPopular: true,
    prepTime: "5-7 min"
  },
  {
    id: "d3",
    name: "Kesar Pista Kulfi",
    description: "Rich, creamy, slow-reduced traditional Indian ice cream flavored with saffron, cardamom, and loaded with pistachios.",
    price: 130,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1505394033774-8efff55ba7e0?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    isVegetarian: true,
    isPopular: true,
    prepTime: "5 min"
  },
  {
    id: "dr3",
    name: "Imperial Cold Coffee",
    description: "Rich espresso blended with chilled milk and premium vanilla ice cream, topped with fine cocoa powder.",
    price: 150,
    category: "Drinks & Mocktails",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    isVegetarian: true,
    isPopular: false,
    prepTime: "5 min"
  }
];
