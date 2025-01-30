import { Product, ProductCategory } from '@features/admin/models/product.model';

export const dummyProducts: Product[] = [
  {
    publicId: '1',
    brand: 'Brand A',
    color: 'Red',
    description: 'High-quality product for the premium market.',
    name: 'Product A',
    price: 100,
    size: 'M',
    category: { publicId: '1', name: 'Category A' },
    featured: true,
    pictures: [
      {
        file: new File([''], 'imageA1.jpg', { type: 'image/jpeg' }),
        mimeType: 'image/jpeg',
      },
      {
        file: new File([''], 'imageA2.jpg', { type: 'image/jpeg' }),
        mimeType: 'image/jpeg',
      },
    ],
    nbInStock: 50,
  },
  {
    publicId: '2',
    brand: 'Brand B',
    color: 'Blue',
    description: 'Comfortable and stylish product for daily use.',
    name: 'Product B',
    price: 120,
    size: 'L',
    category: { publicId: '2', name: 'Category B' },
    featured: false,
    pictures: [
      {
        file: new File([''], 'imageB1.png', { type: 'image/png' }),
        mimeType: 'image/png',
      },
      {
        file: new File([''], 'imageB2.png', { type: 'image/png' }),
        mimeType: 'image/png',
      },
    ],
    nbInStock: 30,
  },
  {
    publicId: '3',
    brand: 'Brand C',
    color: 'Green',
    description: 'Sports gear made with high performance in mind.',
    name: 'Product C',
    price: 180,
    size: 'XL',
    category: { publicId: '3', name: 'Category C' },
    featured: true,
    pictures: [
      {
        file: new File([''], 'imageC1.jpg', { type: 'image/jpeg' }),
        mimeType: 'image/jpeg',
      },
      {
        file: new File([''], 'imageC2.jpg', { type: 'image/jpeg' }),
        mimeType: 'image/jpeg',
      },
    ],
    nbInStock: 40,
  },
  {
    publicId: '4',
    brand: 'Brand D',
    color: 'Black',
    description: 'Luxury product for those who demand the best.',
    name: 'Product D',
    price: 250,
    size: 'XXL',
    category: { publicId: '4', name: 'Category D' },
    featured: true,
    pictures: [
      {
        file: new File([''], 'imageD1.png', { type: 'image/png' }),
        mimeType: 'image/png',
      },
      {
        file: new File([''], 'imageD2.png', { type: 'image/png' }),
        mimeType: 'image/png',
      },
    ],
    nbInStock: 15,
  },
  {
    publicId: '5',
    brand: 'Brand E',
    color: 'Yellow',
    description: 'Casual wear for every occasion.',
    name: 'Product E',
    price: 60,
    size: 'S',
    category: { publicId: '5', name: 'Category E' },
    featured: false,
    pictures: [
      {
        file: new File([''], 'imageE1.jpg', { type: 'image/jpeg' }),
        mimeType: 'image/jpeg',
      },
      {
        file: new File([''], 'imageE2.jpg', { type: 'image/jpeg' }),
        mimeType: 'image/jpeg',
      },
    ],
    nbInStock: 70,
  },
  {
    publicId: '6',
    brand: 'Brand F',
    color: 'Pink',
    description: 'Stylish and trendy accessories.',
    name: 'Product F',
    price: 30,
    size: 'M',
    category: { publicId: '6', name: 'Category F' },
    featured: false,
    pictures: [
      {
        file: new File([''], 'imageF1.png', { type: 'image/png' }),
        mimeType: 'image/png',
      },
      {
        file: new File([''], 'imageF2.png', { type: 'image/png' }),
        mimeType: 'image/png',
      },
    ],
    nbInStock: 20,
  },
  {
    publicId: '7',
    brand: 'Brand G',
    color: 'White',
    description: 'Top-quality electronics for personal use.',
    name: 'Product G',
    price: 300,
    size: 'XXXL',
    category: { publicId: '7', name: 'Category G' },
    featured: true,
    pictures: [
      {
        file: new File([''], 'imageG1.jpg', { type: 'image/jpeg' }),
        mimeType: 'image/jpeg',
      },
      {
        file: new File([''], 'imageG2.jpg', { type: 'image/jpeg' }),
        mimeType: 'image/jpeg',
      },
    ],
    nbInStock: 25,
  },
  {
    publicId: '8',
    brand: 'Brand H',
    color: 'Grey',
    description: 'A stylish and functional product for everyone.',
    name: 'Product H',
    price: 90,
    size: 'L',
    category: { publicId: '8', name: 'Category H' },
    featured: false,
    pictures: [
      {
        file: new File([''], 'imageH1.jpg', { type: 'image/jpeg' }),
        mimeType: 'image/jpeg',
      },
      {
        file: new File([''], 'imageH2.jpg', { type: 'image/jpeg' }),
        mimeType: 'image/jpeg',
      },
    ],
    nbInStock: 60,
  },
];

export const dummyCategories: ProductCategory[] = [
  { publicId: '1', name: 'Category A' },
  { publicId: '2', name: 'Category B' },
  { publicId: '3', name: 'Category C' },
  { publicId: '4', name: 'Category D' },
  { publicId: '5', name: 'Category E' },
  { publicId: '6', name: 'Category F' },
  { publicId: '7', name: 'Category G' },
  { publicId: '8', name: 'Category H' },
];
