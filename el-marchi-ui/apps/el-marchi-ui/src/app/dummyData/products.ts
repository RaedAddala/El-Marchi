import { Product, ProductCategory } from '@shared/models/product.model';

export const dummyCategories: ProductCategory[] = [

  // Clothing Categories
  { publicId: 'mens-clothing', name: 'Men\'s Clothing' },
  { publicId: 'womens-clothing', name: 'Women\'s Clothing' },
  { publicId: 'activewear', name: 'Activewear' },
  { publicId: 'outerwear', name: 'Outerwear' },

  // Accessories Categories
  { publicId: 'bags', name: 'Bags & Luggage' },
  { publicId: 'accessories', name: 'Accessories' },
  { publicId: 'jewelry', name: 'Jewelry' },

  // Furniture Categories
  { publicId: 'living-room', name: 'Living Room' },
  { publicId: 'bedroom', name: 'Bedroom' },
  { publicId: 'office', name: 'Office' },
  { publicId: 'outdoor', name: 'Outdoor' },

  // Specific Product Types
  { publicId: 'denim', name: 'Denim' },
  { publicId: 'footwear', name: 'Footwear' },
  { publicId: 'basics', name: 'Basics' }
];

export const dummyProducts: Product[] = [

  // Clothing
  {
    publicId: 'slim-fit-blazer',
    brand: 'Hugo Boss',
    color: '#1C1C1C', // Charcoal
    description: 'Tailored slim-fit blazer in Italian wool blend. Features notched lapels, two-button closure, and four-button cuffs. Perfect for both business and formal occasions.',
    name: 'Slim-Fit Wool Blazer',
    price: 599.99,
    size: '40R',
    category: { publicId: 'mens-clothing', name: 'Men\'s Clothing' },
    featured: true,
    pictures: [
      { publicId: 'slim-fit-blazer-1', mimeType: 'image/jpeg' },
      { publicId: 'slim-fit-blazer-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 25,
  },
  {
    publicId: 'cashmere-sweater',
    brand: 'Ralph Lauren',
    color: '#8B4513', // Saddle Brown
    description: 'Luxurious pure cashmere sweater with ribbed crew neck, cuffs, and hem. Made from the finest Mongolian cashmere for ultimate softness and warmth.',
    name: 'Pure Cashmere Crew Neck Sweater',
    price: 299.99,
    size: 'M',
    category: { publicId: 'mens-clothing', name: 'Men\'s Clothing' },
    featured: false,
    pictures: [
      { publicId: 'cashmere-sweater-1', mimeType: 'image/jpeg' },
      { publicId: 'cashmere-sweater-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 30,
  },

  // Luggage
  {
    publicId: 'leather-weekender',
    brand: 'Samsonite',
    color: '#8B4513', // Cognac
    description: 'Premium leather weekender bag with durable canvas lining. Features brass hardware, multiple compartments, and a removable shoulder strap. Perfect for short trips.',
    name: 'Leather Weekender Bag',
    price: 399.99,
    size: 'One Size',
    category: { publicId: 'bags', name: 'Bags & Luggage' },
    featured: true,
    pictures: [
      { publicId: 'leather-weekender-1', mimeType: 'image/jpeg' },
      { publicId: 'leather-weekender-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 15,
  },
  {
    publicId: 'hardside-carry-on',
    brand: 'Away',
    color: '#000000', // Black
    description: 'Durable polycarbonate carry-on with built-in USB charger. Features TSA-approved lock, 360° spinner wheels, and compression system.',
    name: 'Smart Carry-On Luggage',
    price: 245.00,
    size: '22"',
    category: { publicId: 'bags', name: 'Bags & Luggage' },
    featured: true,
    pictures: [
      { publicId: 'hardside-carry-on-1', mimeType: 'image/jpeg' },
      { publicId: 'hardside-carry-on-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 45,
  },

  // Furniture
  {
    publicId: 'leather-sectional',
    brand: 'West Elm',
    color: '#8B4513', // Saddle Brown
    description: 'Modern leather sectional sofa with chaise. Features top-grain leather upholstery, kiln-dried hardwood frame, and down-filled cushions.',
    name: 'Modern Leather Sectional',
    price: 2999.99,
    size: '120" x 85"',
    category: { publicId: 'living-room', name: 'Living Room' },
    featured: true,
    pictures: [
      { publicId: 'leather-sectional-1', mimeType: 'image/jpeg' },
      { publicId: 'leather-sectional-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 5,
  },
  {
    publicId: 'ergonomic-chair',
    brand: 'Herman Miller',
    color: '#000000', // Black
    description: 'Premium ergonomic office chair with PostureFit SL technology. Features fully adjustable arms, seat depth, and lumbar support.',
    name: 'Aeron Ergonomic Chair',
    price: 1495.00,
    size: 'Size B',
    category: { publicId: 'office', name: 'Office' },
    featured: false,
    pictures: [
      { publicId: 'ergonomic-chair-1', mimeType: 'image/jpeg' },
      { publicId: 'ergonomic-chair-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 20,
  },

  // More clothing
  {
    publicId: 'silk-blouse',
    brand: 'Equipment',
    color: '#FFF5EE', // Ivory
    description: 'Classic silk blouse with hidden button placket. Made from 100% silk crepe de chine with a slightly relaxed fit.',
    name: 'Silk Button-Down Blouse',
    price: 220.00,
    size: 'S',
    category: { publicId: 'womens-clothing', name: 'Women\'s Clothing' },
    featured: true,
    pictures: [
      { publicId: 'silk-blouse-1', mimeType: 'image/jpeg' },
      { publicId: 'silk-blouse-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 35,
  },

  // Accessories
  {
    publicId: 'leather-wallet',
    brand: 'Montblanc',
    color: '#000000', // Black
    description: 'Luxury leather wallet with RFID protection. Features 6 card slots, 2 bill compartments, and coin pocket.',
    name: 'Meisterstück Wallet',
    price: 295.00,
    size: 'One Size',
    category: { publicId: 'accessories', name: 'Accessories' },
    featured: false,
    pictures: [
      { publicId: 'leather-wallet-1', mimeType: 'image/jpeg' },
      { publicId: 'leather-wallet-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 50,
  },
  // Women's Clothing
  {
    publicId: 'midi-wrap-dress',
    brand: 'Reformation',
    color: '#006400', // Dark Green
    description: 'Sustainable silk midi wrap dress with flutter sleeves. Features a flattering V-neck design and adjustable waist tie.',
    name: 'Silk Wrap Midi Dress',
    price: 278.00,
    size: 'M',
    category: { publicId: 'womens-clothing', name: 'Women\'s Clothing' },
    featured: true,
    pictures: [
      { publicId: 'midi-wrap-dress-1', mimeType: 'image/jpeg' },
      { publicId: 'midi-wrap-dress-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 28,
  },
  {
    publicId: 'cashmere-cardigan',
    brand: 'Vince',
    color: '#F5F5DC', // Beige
    description: 'Oversized cashmere cardigan with dropped shoulders and patch pockets. Perfect for layering in any season.',
    name: 'Oversized Cashmere Cardigan',
    price: 425.00,
    size: 'L',
    category: { publicId: 'womens-clothing', name: 'Women\'s Clothing' },
    featured: false,
    pictures: [
      { publicId: 'cashmere-cardigan-1', mimeType: 'image/jpeg' },
      { publicId: 'cashmere-cardigan-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 15,
  },

  // Men's Outerwear
  {
    publicId: 'quilted-jacket',
    brand: 'Barbour',
    color: '#2F4F4F', // Dark Slate Gray
    description: 'Diamond-quilted jacket with corduroy collar. Features snap-close front and multiple pockets.',
    name: 'Classic Quilted Jacket',
    price: 395.00,
    size: 'XL',
    category: { publicId: 'outerwear', name: 'Outerwear' },
    featured: true,
    pictures: [
      { publicId: 'quilted-jacket-1', mimeType: 'image/jpeg' },
      { publicId: 'quilted-jacket-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 20,
  },

  // Activewear
  {
    publicId: 'compression-leggings',
    brand: 'Lululemon',
    color: '#000080', // Navy
    description: 'High-rise compression leggings with hidden pocket. Made with sweat-wicking, four-way stretch fabric.',
    name: 'High-Rise Training Leggings',
    price: 128.00,
    size: 'S',
    category: { publicId: 'activewear', name: 'Activewear' },
    featured: false,
    pictures: [
      { publicId: 'compression-leggings-1', mimeType: 'image/jpeg' },
      { publicId: 'compression-leggings-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 45,
  },

  // Bedroom Furniture
  {
    publicId: 'platform-bed',
    brand: 'Article',
    color: '#8B4513', // Walnut
    description: 'Modern platform bed with solid wood frame and headboard. Features clean lines and Japanese-inspired design.',
    name: 'Walnut Platform Bed Frame',
    price: 1299.00,
    size: 'Queen',
    category: { publicId: 'bedroom', name: 'Bedroom' },
    featured: true,
    pictures: [
      { publicId: 'platform-bed-1', mimeType: 'image/jpeg' },
      { publicId: 'platform-bed-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 8,
  },
  {
    publicId: 'dresser-walnut',
    brand: 'CB2',
    color: '#8B4513', // Walnut
    description: 'Six-drawer dresser in solid walnut with brass handles. Features soft-close drawers and dovetail joinery.',
    name: 'Modern Walnut Dresser',
    price: 1599.00,
    size: '60"W x 20"D x 30"H',
    category: { publicId: 'bedroom', name: 'Bedroom' },
    featured: false,
    pictures: [
      { publicId: 'dresser-walnut-1', mimeType: 'image/jpeg' },
      { publicId: 'dresser-walnut-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 6,
  },

  // Living Room Furniture
  {
    publicId: 'velvet-sofa',
    brand: 'Interior Define',
    color: '#2E8B57', // Sea Green
    description: 'Custom velvet sofa with down-filled cushions. Features turned wood legs and classic tufted design.',
    name: 'Maxwell Velvet Sofa',
    price: 2199.00,
    size: '88"W x 38"D x 34"H',
    category: { publicId: 'living-room', name: 'Living Room' },
    featured: true,
    pictures: [
      { publicId: 'velvet-sofa-1', mimeType: 'image/jpeg' },
      { publicId: 'velvet-sofa-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 4,
  },

  // Office Furniture
  {
    publicId: 'standing-desk',
    brand: 'Fully',
    color: '#FFFFFF', // White
    description: 'Electric standing desk with memory presets. Features dual motors and bamboo desktop.',
    name: 'Jarvis Standing Desk',
    price: 599.00,
    size: '60"W x 30"D',
    category: { publicId: 'office', name: 'Office' },
    featured: false,
    pictures: [
      { publicId: 'standing-desk-1', mimeType: 'image/jpeg' },
      { publicId: 'standing-desk-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 12,
  },

  // Outdoor Furniture
  {
    publicId: 'teak-dining-set',
    brand: 'Pottery Barn',
    color: '#DEB887', // Teak
    description: 'Weather-resistant teak dining set including table and six chairs. Perfect for outdoor entertaining.',
    name: 'Teak Outdoor Dining Set',
    price: 2899.00,
    size: 'Table: 72"L x 38"W',
    category: { publicId: 'outdoor', name: 'Outdoor' },
    featured: true,
    pictures: [
      { publicId: 'teak-dining-set-1', mimeType: 'image/jpeg' },
      { publicId: 'teak-dining-set-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 3,
  },

  // Luggage
  {
    publicId: 'checked-luggage',
    brand: 'Rimowa',
    color: '#C0C0C0', // Silver
    description: 'Premium aluminum checked luggage with TSA-approved locks. Features smooth-rolling wheels and telescopic handle.',
    name: 'Original Check-In Large',
    price: 1299.00,
    size: '29"H x 20"W x 10"D',
    category: { publicId: 'bags', name: 'Bags & Luggage' },
    featured: true,
    pictures: [
      { publicId: 'checked-luggage-1', mimeType: 'image/jpeg' },
      { publicId: 'checked-luggage-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 10,
  },

  // Accessories
  {
    publicId: 'silk-scarf',
    brand: 'Hermès',
    color: '#E6E6FA', // Lavender
    description: 'Hand-rolled silk twill scarf with signature print. Made in France.',
    name: 'Carré Classic Silk Scarf',
    price: 435.00,
    size: '90cm x 90cm',
    category: { publicId: 'accessories', name: 'Accessories' },
    featured: true,
    pictures: [
      { publicId: 'silk-scarf-1', mimeType: 'image/jpeg' },
      { publicId: 'silk-scarf-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 7,
  },

  // Jewelry
  {
    publicId: 'gold-necklace',
    brand: 'Mejuri',
    color: '#FFD700', // Gold
    description: '14k solid gold necklace with delicate chain. Perfect for everyday wear.',
    name: 'Diamond Necklace',
    price: 350.00,
    size: '16"',
    category: { publicId: 'jewelry', name: 'Jewelry' },
    featured: false,
    pictures: [
      { publicId: 'gold-necklace-1', mimeType: 'image/jpeg' },
      { publicId: 'gold-necklace-2', mimeType: 'image/jpeg' }
    ],
    nbInStock: 25,
  }
];
