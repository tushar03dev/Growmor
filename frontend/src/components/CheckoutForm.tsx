import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface CheckoutFormProps {
  cartItems: any[];
  total: number;
  onSuccess: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartItems, total, onSuccess }) => {
  const [form, setForm] = useState({
    shippingName: '',
    shippingPhone: '',
    shippingAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First, create a payment (you'll need to implement this with your payment provider)
      const paymentResponse = await fetch('http://localhost:5000/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: total })
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentData.message || 'Payment failed');
      }

      // Then create the order
      const orderResponse = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems,
          shippingName: form.shippingName,
          shippingPhone: form.shippingPhone,
          shippingAddress: form.shippingAddress,
          paymentId: paymentData.id
        })
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'Order creation failed');
      }

      onSuccess();
      navigate(`/order-success/${orderData.id}`);

    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          name="shippingName"
          value={form.shippingName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone Number</label>
        <input
          type="tel"
          name="shippingPhone"
          value={form.shippingPhone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="+91 1234567890"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Shipping Address</label>
        <textarea
          name="shippingAddress"
          value={form.shippingAddress}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows={3}
          placeholder="Enter your complete shipping address"
          required
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="border-t pt-4">
        <div className="flex justify-between mb-4">
          <span className="font-medium">Total Amount:</span>
          <span className="font-bold">₹{total.toFixed(2)}</span>
        </div>

        <button
          type="submit"
          className="w-full bg-growmor-green-dark text-white py-3 rounded hover:bg-growmor-green-dark/90 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
