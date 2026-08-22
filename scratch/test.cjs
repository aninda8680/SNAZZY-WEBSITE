const fs = require('fs');

const product = {
  id: 1,
  name: 'Snazzy Tee — T1',
  category: "Men's T-Shirts",
  description:
    'Our signature piece — a 220gsm heavyweight cotton tee with precision embroidery across the chest. Designed for those who believe clothing should say something.',
  bullets: [
    'Material: 100% combed ring-spun cotton, 220gsm',
    'Care: Machine wash cold (30°C), inside out. Do not tumble dry.',
  ],
  images: ['/images/T1-FRNT.png', '/images/t1-back.png'],
  price: '₹1,499',
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  badge: 'Bestseller',
};

const theme = {
  bg: '#FAF5E8',
  text: '#1B3C34',
  accent: '#1B3C34',
  border: 'rgba(27,60,52,0.1)',
  subtleText: 'rgba(27,60,52,0.55)',
  font: 'light',
  hideShadow: true,
};

const isMissingData = product && (!theme || !product.images || product.images.length === 0 || !product.name);

console.log("isMissingData is:", isMissingData);
