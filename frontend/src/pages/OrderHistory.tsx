import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  plant?: {
    name: string;
    imageUrl: string;
  };
  product?: {
    name: string;
    imageUrl: string;
  };
}

interface Order {
  id: number;
  status: string;
  createdAt: string;
  shippingName: string;
  shippingAddress: string;
  shippingPhone: string;
  orderItems: OrderItem[];
}

const OrderHistory = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-600">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                  <p className="text-sm text-gray-600">
                    Placed on {format(new Date(order.createdAt), 'PPP')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Shipping Details</h3>
                <p className="text-sm text-gray-600">{order.shippingName}</p>
                <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                <p className="text-sm text-gray-600">{order.shippingPhone}</p>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.plant?.imageUrl || item.product?.imageUrl}
                        alt={item.plant?.name || item.product?.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">
                          {item.plant?.name || item.product?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
