// Exporting Module
console.log('Exporting Module');

const shippingCost = 10;
export const cart = [];
const totalPrice = 237;
const totalQuanitty = 23;

export { totalPrice, totalQuanitty as tq };

export const addToCart = function (product, quantity) {
  cart.push(product, quantity);
  console.log(`${quantity} ${product} added to cart`);
};

export default function (product, quantity) {
  cart.push(product, quantity);
  console.log(`${quantity} ${product} added to cart`);
}
