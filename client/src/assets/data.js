import product_1 from "./product_1.png";
import product_2 from "./product_2.png";
import product_3 from "./product_3.png";
import product_4 from "./product_4.png";
import product_5 from "./product_5.png";
import product_6 from "./product_6.png";
import product_7 from "./product_7.png";
import product_8 from "./product_8.png";
import product_9 from "./product_9.png";
import product_10 from "./product_10.png";
import product_11 from "./product_11.png";
import product_12 from "./product_12.png";
import product_13 from "./product_13.png";
import product_14 from "./product_14.png";
import product_15 from "./product_15.png";
import product_16 from "./product_16.png";
import product_17 from "./product_17.png";
import product_18 from "./product_18.png";
import product_19 from "./product_19.png";
import product_20 from "./product_20.png";
import product_21 from "./product_21.png";
import product_22 from "./product_22.png";
import product_23 from "./product_23.png";
import product_24 from "./product_24.png";
import product_25 from "./product_25.png";
import product_26 from "./product_26.png";
import product_27 from "./product_27.png";
import product_28 from "./product_28.png";
import product_29 from "./product_29.png";
import product_30 from "./product_30.png";
import product_31 from "./product_31.png";
import product_32 from "./product_32.png";
import product_33 from "./product_33.png";
import product_34 from "./product_34.png";
import product_35 from "./product_35.png";
import product_36 from "./product_36.png";
import product_37 from "./product_37.png";
import product_38 from "./product_38.png";
import warm from "./warm wood.jpg";
import whitejasmine from "./White jasmine.png";
import whiteorchids from "./White orchids.png";
import oudwood from "./oud wood.png";
import softpink from "./soft pink.jpg";
import orange from "./orange blossom.jpg";

import blog1 from "../assets/blogs/blog1.png";
import blog2 from "../assets/blogs/blog2.png";
import blog3 from "../assets/blogs/blog3.png";
import blog4 from "../assets/blogs/blog4.png";

export const categories = [
  { name: "Serenity",   image: whitejasmine },
  { name: "Signature",  image: whiteorchids },
  { name: "Oud",        image: oudwood },
  { name: "Floral",     image: softpink },
  { name: "Citrus",     image: orange },
  { name: "Woody",      image: warm },
];

export const dummyProducts = [
  { _id: "1",  name: "Velvet Noir Luxury Candle",                    image: [product_1, product_3, product_6, product_7], price: 95,  offerPrice: 45, sizes: ["S", "M", "L"],       description: "A deep, smoky blend of black oud and velvet musk that transforms any room into a sanctuary of mystery.", category: "Oud",       popular: true,  inStock: true },
  { _id: "2",  name: "Rose Petal & Sandalwood Candle",               image: [product_2],                                  price: 89,  offerPrice: 40, sizes: ["S", "M", "L", "XL"], description: "Delicate rose petals entwined with warm sandalwood create a timeless floral fragrance.",               category: "Floral",    popular: true,  inStock: true },
  { _id: "3",  name: "Midnight Amber Pillar Candle",                 image: [product_3],                                  price: 92,  offerPrice: 35, sizes: ["S", "M", "L"],       description: "Rich amber and dark vanilla melt together in this bold, warming evening candle.",                     category: "Signature", popular: false, inStock: true },
  { _id: "4",  name: "Golden Ember Scented Candle",                  image: [product_4],                                  price: 98,  offerPrice: 50, sizes: ["M", "L", "XL"],      description: "Warm embers of cedarwood and spiced clove fill your space with cozy, golden warmth.",                category: "Woody",     popular: true,  inStock: true },
  { _id: "5",  name: "White Tea & Jasmine Candle",                   image: [product_5],                                  price: 85,  offerPrice: 30, sizes: ["S", "M", "L", "XL"], description: "A light, airy blend of white tea and fresh jasmine — perfect for morning rituals.",                  category: "Serenity",  popular: false, inStock: true },
  { _id: "6",  name: "Cedarwood & Smoke Artisan Candle",             image: [product_6],                                  price: 97,  offerPrice: 40, sizes: ["S", "M", "L"],       description: "Rugged cedarwood meets a whisper of smoke for a bold, masculine atmosphere.",                        category: "Woody",     popular: false, inStock: true },
  { _id: "7",  name: "Lavender Fields Soy Candle",                   image: [product_7],                                  price: 99,  offerPrice: 50, sizes: ["S", "M", "L", "XL"], description: "Pure lavender fields captured in a slow-burning soy wax candle for ultimate relaxation.",             category: "Serenity",  popular: true,  inStock: true },
  { _id: "8",  name: "Serenity Collection — Calm & Clarity",         image: [product_8],                                  price: 93,  offerPrice: 45, sizes: ["M", "L", "XL"],      description: "Our signature Serenity blend of eucalyptus, mint, and soft musk for a clear, calm mind.",           category: "Serenity",  popular: true,  inStock: true },
  { _id: "9",  name: "Signature Noir — Luxury Gift Candle",          image: [product_9],                                  price: 95,  offerPrice: 40, sizes: ["S", "M", "L"],       description: "The crown jewel of the AVAIA Signature line — dark florals, oud, and a hint of bergamot.",          category: "Signature", popular: true,  inStock: true },
  { _id: "10", name: "Citrus Burst & Neroli Candle",                 image: [product_10],                                 price: 88,  offerPrice: 35, sizes: ["S", "M", "L", "XL"], description: "Zesty citrus and delicate neroli blossom combine for an uplifting, energising fragrance.",           category: "Citrus",    popular: false, inStock: true },
  { _id: "11", name: "Bergamot & Lemon Verbena Candle",              image: [product_11],                                 price: 79,  offerPrice: 30, sizes: ["S", "M", "L"],       description: "Bright bergamot and lemon verbena create a fresh, sun-drenched atmosphere in any room.",             category: "Citrus",    popular: false, inStock: true },
  { _id: "12", name: "Oud & Saffron Prestige Candle",                image: [product_12],                                 price: 99,  offerPrice: 45, sizes: ["M", "L", "XL"],      description: "A prestige blend of rare oud and golden saffron — opulent, warm, and deeply luxurious.",            category: "Oud",       popular: true,  inStock: true },
  { _id: "13", name: "Peony & Blush Rose Candle",                    image: [product_13],                                 price: 93,  offerPrice: 50, sizes: ["S", "M", "L"],       description: "Soft peony and blush rose petals bloom in this elegant, feminine floral candle.",                   category: "Floral",    popular: false, inStock: true },
  { _id: "14", name: "Gardenia & Lily Blossom Candle",               image: [product_14],                                 price: 89,  offerPrice: 40, sizes: ["M", "L", "XL"],      description: "Lush gardenia and lily blossom fill your home with the scent of a blooming garden.",                category: "Floral",    popular: false, inStock: true },
  { _id: "15", name: "Oud Collection — Ritual Candle",               image: [product_15],                                 price: 79,  offerPrice: 35, sizes: ["S", "M", "L"],       description: "Inspired by ancient rituals, this oud candle burns slowly to release deep, resinous warmth.",       category: "Oud",       popular: false, inStock: true },
  { _id: "16", name: "Warm Vanilla & Tonka Bean Candle",             image: [product_16],                                 price: 85,  offerPrice: 40, sizes: ["S", "M", "L", "XL"], description: "Indulgent warm vanilla and tonka bean create a comforting, dessert-like fragrance.",                category: "Signature", popular: false, inStock: true },
  { _id: "17", name: "Cashmere & Musk Luxury Candle",                image: [product_17],                                 price: 92,  offerPrice: 50, sizes: ["M", "L", "XL"],      description: "Soft cashmere and clean musk weave together in this understated, sophisticated candle.",             category: "Serenity",  popular: false, inStock: true },
  { _id: "18", name: "Patchouli & Dark Rose Candle",                 image: [product_18],                                 price: 88,  offerPrice: 40, sizes: ["S", "M", "L", "XL"], description: "Earthy patchouli and dark rose create a moody, sensual fragrance for intimate evenings.",            category: "Floral",    popular: false, inStock: true },
  { _id: "19", name: "Coconut & Sea Salt Candle",                    image: [product_19],                                 price: 49,  offerPrice: 20, sizes: ["S", "M", "L"],       description: "Tropical coconut and fresh sea salt transport you to a sun-soaked shoreline.",                      category: "Citrus",    popular: false, inStock: true },
  { _id: "20", name: "Grapefruit & Mint Refresh Candle",             image: [product_20],                                 price: 69,  offerPrice: 30, sizes: ["M", "L", "XL"],      description: "Invigorating grapefruit and cool mint make this the perfect candle for a morning refresh.",         category: "Citrus",    popular: false, inStock: true },
  { _id: "21", name: "Oakmoss & Vetiver Forest Candle",              image: [product_21],                                 price: 85,  offerPrice: 40, sizes: ["S", "M", "L", "XL"], description: "Deep oakmoss and smoky vetiver evoke a walk through an ancient forest at dusk.",                    category: "Woody",     popular: false, inStock: true },
  { _id: "22", name: "Mahogany & Teakwood Candle",                   image: [product_22],                                 price: 90,  offerPrice: 45, sizes: ["S", "M", "L"],       description: "Rich mahogany and polished teakwood create a refined, masculine atmosphere.",                       category: "Woody",     popular: false, inStock: true },
  { _id: "23", name: "Floral Collection — Garden in Bloom",          image: [product_23],                                 price: 98,  offerPrice: 48, sizes: ["S", "M", "L", "XL"], description: "A curated bouquet of spring florals — peony, freesia, and lily — in one stunning candle.",          category: "Floral",    popular: false, inStock: true },
  { _id: "24", name: "Amber & Cardamom Spice Candle",                image: [product_24],                                 price: 92,  offerPrice: 42, sizes: ["M", "L", "XL"],      description: "Warm amber and exotic cardamom spice create a rich, festive fragrance for any occasion.",           category: "Signature", popular: false, inStock: true },
  { _id: "25", name: "Eucalyptus & Spearmint Spa Candle",            image: [product_25],                                 price: 95,  offerPrice: 45, sizes: ["S", "M", "L", "XL"], description: "Crisp eucalyptus and spearmint bring the spa experience directly into your home.",                  category: "Serenity",  popular: false, inStock: true },
  { _id: "26", name: "Lemongrass & Ginger Candle",                   image: [product_26],                                 price: 70,  offerPrice: 30, sizes: ["S", "M", "L", "XL"], description: "Vibrant lemongrass and warming ginger combine for a lively, uplifting fragrance.",                  category: "Citrus",    popular: false, inStock: true },
  { _id: "27", name: "Citrus Collection — Sunrise Ritual",           image: [product_27],                                 price: 85,  offerPrice: 45, sizes: ["S", "M", "L"],       description: "Start your day with this bright citrus blend of orange, lemon, and grapefruit zest.",               category: "Citrus",    popular: false, inStock: true },
  { _id: "28", name: "Frankincense & Myrrh Sacred Candle",           image: [product_28],                                 price: 90,  offerPrice: 50, sizes: ["S", "M", "L", "XL"], description: "Ancient frankincense and myrrh resins create a sacred, meditative atmosphere.",                     category: "Oud",       popular: false, inStock: true },
  { _id: "29", name: "Neroli & Petitgrain Candle",                   image: [product_29],                                 price: 70,  offerPrice: 40, sizes: ["M", "L", "XL"],      description: "Delicate neroli blossom and fresh petitgrain create a light, sophisticated fragrance.",             category: "Floral",    popular: false, inStock: true },
  { _id: "30", name: "Tobacco & Honey Artisan Candle",               image: [product_30],                                 price: 28,  offerPrice: 15, sizes: ["S", "M", "L", "XL"], description: "Sweet honey and rich tobacco leaf create a warm, indulgent fragrance with depth.",                  category: "Signature", popular: false, inStock: true },
  { _id: "31", name: "Pine & Fir Needle Winter Candle",              image: [product_31],                                 price: 50,  offerPrice: 25, sizes: ["S", "M", "L"],       description: "Fresh pine and fir needle bring the crisp scent of a winter forest into your home.",                category: "Woody",     popular: false, inStock: true },
  { _id: "32", name: "Woody Collection — Dusk & Ember",              image: [product_32],                                 price: 35,  offerPrice: 18, sizes: ["S", "M", "L", "XL"], description: "Our Woody Collection signature — smoked birch, amber, and a whisper of vanilla.",                  category: "Woody",     popular: false, inStock: true },
  { _id: "33", name: "Jasmine & Tuberose Night Candle",              image: [product_33],                                 price: 48,  offerPrice: 20, sizes: ["S", "M", "L"],       description: "Heady jasmine and tuberose bloom at night in this intoxicating, romantic candle.",                 category: "Floral",    popular: false, inStock: true },
  { _id: "34", name: "Black Oud & Leather Candle",                   image: [product_34],                                 price: 60,  offerPrice: 25, sizes: ["S", "M", "L", "XL"], description: "Bold black oud and smooth leather create a powerful, commanding fragrance.",                        category: "Oud",       popular: false, inStock: true },
  { _id: "35", name: "Bamboo & Green Tea Candle",                    image: [product_35],                                 price: 75,  offerPrice: 35, sizes: ["S", "M", "L", "XL"], description: "Clean bamboo and delicate green tea create a zen-inspired, calming atmosphere.",                    category: "Serenity",  popular: false, inStock: true },
  { _id: "36", name: "Woody Collection — Signature Blend",           image: [product_36],                                 price: 55,  offerPrice: 20, sizes: ["S", "M", "L"],       description: "Our most beloved woody blend — sandalwood, cedar, and a touch of warm amber.",                     category: "Woody",     popular: true,  inStock: true },
  { _id: "37", name: "Champagne & Peach Celebration Candle",         image: [product_37],                                 price: 80,  offerPrice: 40, sizes: ["S", "M", "L", "XL"], description: "Sparkling champagne and ripe peach make this the perfect candle for celebrations.",                category: "Citrus",    popular: false, inStock: true },
  { _id: "38", name: "Signature Collection — The AVAIA Classic",     image: [product_38],                                 price: 65,  offerPrice: 28, sizes: ["S", "M", "L", "XL"], description: "The original AVAIA candle — a timeless blend of rose, oud, and warm amber that started it all.",   category: "Signature", popular: true,  inStock: true },
];

export const blogs = [
  { title: "The Art of Layering Fragrances at Home",       category: "Serenity", image: blog1 },
  { title: "How Scent Shapes Your Mood and Space",         category: "Signature", image: blog2 },
  { title: "The Story Behind Velvet Oud",                  category: "Oud",      image: blog3 },
  { title: "Candle Care: Getting the Most from Your AVAIA", category: "Lifestyle", image: blog4 },
];

export const dummyOrders = [
  {
    _id: "66i7guy876h756gwgreghc56456v5tc",
    userId: "68591d36daf423db94fa8f4f",
    items: [
      { product: dummyProducts[0], quantity: 2, size: "M" },
      { product: dummyProducts[11], quantity: 1, size: "L" },
    ],
    address: { firstName: "John", lastName: "Doe", street: "123 Main Street", city: "New York", state: "NY", country: "USA", zipcode: "10001", phone: "+1 123 456 7890" },
    amount: 130,
    paymentMethod: "stripe",
    isPaid: true,
    status: "Delivered",
    createdAt: "2024-06-10T10:00:00.000Z",
  },
  {
    _id: "45dfdfy76789012cv45t45c45cct",
    userId: "68591d36daf423db94fa8f4f",
    items: [
      { product: dummyProducts[7], quantity: 2, size: "S" },
      { product: dummyProducts[3], quantity: 1, size: "M" },
    ],
    address: { firstName: "Jane", lastName: "Smith", street: "456 Elm Street", city: "Los Angeles", state: "CA", country: "USA", zipcode: "90001", phone: "+1 987 654 3210" },
    amount: 136,
    paymentMethod: "COD",
    isPaid: false,
    status: "Shipped",
    createdAt: "2024-06-08T15:30:00.000Z",
  },
];
