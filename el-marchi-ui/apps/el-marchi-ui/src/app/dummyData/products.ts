import { Product, ProductCategory } from '@shared/models/product.model';

export const dummyCategories: ProductCategory[] = [
  // Main Categories
  { publicId: 'mens-clothing', name: "Men's Clothing" },
  { publicId: 'womens-clothing', name: "Women's Clothing" },
  { publicId: 'kids-clothing', name: "Kids' Clothing" },
  { publicId: 'activewear', name: 'Activewear' },
  { publicId: 'swimwear', name: 'Swimwear' },
  { publicId: 'lingerie', name: 'Lingerie & Sleepwear' },
  { publicId: 'outerwear', name: 'Outerwear' },
  { publicId: 'footwear', name: 'Footwear' },

  // Sub-Categories
  { publicId: 'mens-tops', name: "Men's Tops" },
  { publicId: 'mens-bottoms', name: "Men's Bottoms" },
  { publicId: 'womens-dresses', name: "Women's Dresses" },
  { publicId: 'womens-tops', name: "Women's Tops" },
  { publicId: 'womens-bottoms', name: "Women's Bottoms" },
  { publicId: 'kids-boys', name: "Boys' Clothing" },
  { publicId: 'kids-girls', name: "Girls' Clothing" },
  { publicId: 'kids-baby', name: 'Baby Clothing' },
  { publicId: 'accessories', name: 'Accessories' },
];

export const dummyProducts: Product[] = [
  {
    id: 'premium-cotton-tee',
    brand: 'Everlane',
    color: '#FFFFFF',
    material: '100% Organic Cotton',
    description:
      'Soft crewneck t-shirt made from premium organic cotton with a relaxed fit',
    name: 'The Organic Cotton Tee',
    price: 35.0,
    size: 'M',
    sku: 'EV-COT-M',
    careInstructions: 'Machine wash cold, tumble dry low',
    subCategory: { publicId: 'mens-tops', name: "Men's Tops" },
    featured: true,
    rating: { average: 4.8, count: 142 },
    tags: ['basics', 'sustainable'],
    isOnSale: false,
    pictures: [
      { publicId: 'cotton-tee-1', mimeType: 'image/webp' },
      { publicId: 'cotton-tee-2', mimeType: 'image/webp' },
    ],
    nbInStock: 75,
  },

  // Women's Dresses
  {
    id: 'midi-silk-dress',
    brand: 'Reformation',
    color: '#FF69B4',
    material: '100% Silk',
    description:
      'Flowy midi dress with adjustable waist tie and hidden pockets',
    name: 'Silk Midi Dress',
    price: 298.0,
    size: 'S',
    sku: 'RF-SILK-S',
    careInstructions: 'Dry clean only',
    subCategory: { publicId: 'womens-dresses', name: "Women's Dresses" },
    featured: true,
    rating: { average: 4.9, count: 89 },
    tags: ['occasion', 'luxury'],
    isOnSale: true,
    salePrice: 238.4,
    pictures: [
      { publicId: 'silk-dress-1', mimeType: 'image/webp' },
      { publicId: 'silk-dress-2', mimeType: 'image/webp' },
    ],
    nbInStock: 15,
  },
  // Footwear
  {
    id: 'classic-sneakers',
    brand: 'Common Projects',
    color: '#FFFFFF',
    material: 'Italian Leather',
    description: 'Minimalist low-top sneakers with gold-numbered serial',
    name: 'Achilles Low Sneakers',
    price: 410.0,
    size: '42',
    sku: 'CP-ACH-42',
    careInstructions: 'Wipe with damp cloth',
    subCategory: { publicId: 'footwear', name: 'Footwear' },
    featured: true,
    rating: { average: 4.9, count: 167 },
    tags: ['luxury', 'essentials'],
    isOnSale: false,
    pictures: [
      { publicId: 'sneakers-1', mimeType: 'image/webp' },
      { publicId: 'sneakers-2', mimeType: 'image/webp' },
    ],
    nbInStock: 12,
  },
  {
    id: 'slim-fit-blazer',
    brand: 'Hugo Boss',
    color: '#1C1C1C', // Charcoal
    description:
      'Tailored slim-fit blazer in Italian wool blend. Features notched lapels, two-button closure, and four-button cuffs. Perfect for both business and formal occasions.',
    name: 'Slim-Fit Wool Blazer',
    price: 599.99,
    size: '40R',
    subCategory: { publicId: 'mens-clothing', name: "Men's Clothing" },
    featured: true,
    pictures: [
      { publicId: 'slim-fit-blazer-1', mimeType: 'image/jpg' },
      { publicId: 'slim-fit-blazer-2', mimeType: 'image/jpg' },
    ],
    nbInStock: 25,
  },
  {
    id: 'cashmere-sweater',
    brand: 'Ralph Lauren',
    color: '#8B4513', // Saddle Brown
    description:
      'Luxurious pure cashmere sweater with ribbed crew neck, cuffs, and hem. Made from the finest Mongolian cashmere for ultimate softness and warmth.',
    name: 'Pure Cashmere Crew Neck Sweater',
    price: 299.99,
    size: 'M',
    subCategory: { publicId: 'mens-clothing', name: "Men's Clothing" },
    featured: false,
    pictures: [
      { publicId: 'cashmere-sweater-1', mimeType: 'image/jpg' },
      { publicId: 'cashmere-sweater-2', mimeType: 'image/jpg' },
    ],
    nbInStock: 30,
  },
  {
    id: 'silk-blouse',
    brand: 'Equipment',
    color: '#FFF5EE', // Ivory
    description:
      'Classic silk blouse with hidden button placket. Made from 100% silk crepe de chine with a slightly relaxed fit.',
    name: 'Silk Button-Down Blouse',
    price: 220.0,
    size: 'S',
    subCategory: { publicId: 'womens-clothing', name: "Women's Clothing" },
    featured: true,
    pictures: [
      { publicId: 'silk-blouse-1', mimeType: 'image/jpg' },
      { publicId: 'silk-blouse-2', mimeType: 'image/jpg' },
    ],
    nbInStock: 35,
  },

  // Accessories
  {
    id: 'leather-wallet',
    brand: 'Montblanc',
    color: '#000000', // Black
    description:
      'Luxury leather wallet with RFID protection. Features 6 card slots, 2 bill compartments, and coin pocket.',
    name: 'Meisterstück Wallet',
    price: 295.0,
    size: 'One Size',
    subCategory: { publicId: 'accessories', name: 'Accessories' },
    featured: false,
    pictures: [
      { publicId: 'leather-wallet-1', mimeType: 'image/jpg' },
      { publicId: 'leather-wallet-2', mimeType: 'image/jpg' },
    ],
    nbInStock: 50,
  },
  // Women's Clothing
  {
    id: 'midi-wrap-dress',
    brand: 'Reformation',
    color: '#006400', // Dark Green
    description:
      'Sustainable silk midi wrap dress with flutter sleeves. Features a flattering V-neck design and adjustable waist tie.',
    name: 'Silk Wrap Midi Dress',
    price: 278.0,
    size: 'M',
    subCategory: { publicId: 'womens-clothing', name: "Women's Clothing" },
    featured: true,
    pictures: [
      { publicId: 'midi-wrap-dress-1', mimeType: 'image/jpg' },
      { publicId: 'midi-wrap-dress-2', mimeType: 'image/jpg' },
    ],
    nbInStock: 28,
  },
  {
    id: 'cashmere-cardigan',
    brand: 'Vince',
    color: '#F5F5DC', // Beige
    description:
      'Oversized cashmere cardigan with dropped shoulders and patch pockets. Perfect for layering in any season.',
    name: 'Oversized Cashmere Cardigan',
    price: 425.0,
    size: 'L',
    subCategory: { publicId: 'womens-clothing', name: "Women's Clothing" },
    featured: false,
    pictures: [
      { publicId: 'cashmere-cardigan-1', mimeType: 'image/jpg' },
      { publicId: 'cashmere-cardigan-2', mimeType: 'image/jpg' },
    ],
    nbInStock: 15,
  },

  // Men's Outerwear
  {
    id: 'quilted-jacket',
    brand: 'Barbour',
    color: '#2F4F4F', // Dark Slate Gray
    description:
      'Diamond-quilted jacket with corduroy collar. Features snap-close front and multiple pockets.',
    name: 'Classic Quilted Jacket',
    price: 395.0,
    size: 'XL',
    subCategory: { publicId: 'outerwear', name: 'Outerwear' },
    featured: true,
    pictures: [
      { publicId: 'quilted-jacket-1', mimeType: 'image/jpeg' },
      { publicId: 'quilted-jacket-2', mimeType: 'image/jpg' },
    ],
    nbInStock: 20,
  },

  // Accessories
  {
    id: 'silk-scarf',
    brand: 'Hermès',
    color: '#E6E6FA', // Lavender
    description:
      'Hand-rolled silk twill scarf with signature print. Made in France.',
    name: 'Carré Classic Silk Scarf',
    price: 435.0,
    size: '90cm x 90cm',
    subCategory: { publicId: 'accessories', name: 'Accessories' },
    featured: true,
    pictures: [
      { publicId: 'silk-scarf-1', mimeType: 'image/jpg' },
      { publicId: 'silk-scarf-2', mimeType: 'image/jpg' },
    ],
    nbInStock: 7,
  },
  {
    id: 'gold-necklace',
    brand: 'Mejuri',
    color: '#FFD700', // Gold
    description:
      '14k solid gold necklace with delicate chain. Perfect for everyday wear.',
    name: 'Gold Necklace',
    price: 350.0,
    size: '16"',
    subCategory: { publicId: 'accessories', name: 'Accessories' },
    featured: false,
    pictures: [
      { publicId: 'gold-necklace-1', mimeType: 'image/jpg' },
      { publicId: 'gold-necklace-2', mimeType: 'image/jpg' },
    ],
    nbInStock: 25,
  },
];
