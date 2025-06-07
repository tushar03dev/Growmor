import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const initialCart = [
  {
    id: 1,
    name: 'Snake Plant',
    image: '/images/plants/snake-plant.jpg',
    price: 499,
    quantity: 1,
  },
  {
    id: 2,
    name: 'ZZ Plant',
    image: '/images/plants/zz-plant.jpg',
    price: 699,
    quantity: 2,
  },
];

const Cart = () => {
  const [cart, setCart] = useState(initialCart);

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart =>
      cart.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCart(cart => cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cart.length > 0 ? 99 : 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Header />
      <main className="flex-grow container-custom py-12">
        <h1 className="text-3xl font-bold mb-8 text-growmor-green-dark">Your Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl mb-6">Your cart is empty.</p>
            <Link to="/shopPlant" className="inline-block bg-growmor-green-dark text-white px-6 py-2 rounded hover:bg-growmor-green-dark/90 transition">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
              <div className="divide-y divide-gray-100">
                {cart.map(item => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-center py-6 gap-6">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg border" />
                    <div className="flex-1 w-full">
                      <h2 className="font-semibold text-lg mb-2">{item.name}</h2>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-growmor-green-dark font-bold text-xl">₹{item.price}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
                          <span className="px-3">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
                        </div>
                        <span className="text-gray-500">Subtotal: ₹{item.price * item.quantity}</span>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:underline text-sm">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link to="/shopPlant" className="text-growmor-green-dark hover:underline">&lt; Continue Shopping</Link>
              </div>
            </div>
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6 h-fit">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <Button className="w-full bg-growmor-green-dark hover:bg-growmor-green-dark/90">Checkout</Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
