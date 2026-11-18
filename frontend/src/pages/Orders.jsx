import React, { useCallback, useContext, useEffect, useState } from 'react'
import ShopContext from '../context/ShopContext.js'
import { getUserOrders } from '../services/orderService'
import { toast } from 'react-toastify'

const Orders = () => {

  const { currency, user } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const response = await getUserOrders(user.id);
      if (response.success) {
        setOrders(response.orders);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status) => {
    const colors = {
      'Order Placed': 'bg-blue-500',
      'Packing': 'bg-yellow-500',
      'Shipped': 'bg-purple-500',
      'Out for delivery': 'bg-orange-500',
      'Delivered': 'bg-green-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className='page-shell page-pad flex min-h-[60vh] items-center justify-center'>
        <p className='text-xl text-gray-600'>Loading your orders...</p>
      </div>
    );
  }

  return (
    <main className='page-shell page-pad page-enter'>

        <div className='mb-8'>
          <p className='eyebrow'>Your wardrobe journey</p>
          <h1 className='editorial-title mt-3'>My orders</h1>
        </div>

        <div>
            {orders.length === 0 ? (
                <div className='text-center py-12'>
                    <p className='text-gray-500 text-lg'>No orders yet</p>
                    <button 
                        onClick={() => window.location.href = '/collection'}
                        className='fashion-button mt-4'
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                orders.map((order) => (
                    <div key={order._id} className='surface-card mb-5 flex flex-col gap-5 p-5 text-[#4f4943] md:flex-row md:items-center md:justify-between sm:p-7'>
                        
                        {/* Left Side: Order Items */}
                        <div className='flex items-start gap-6 text-sm w-full md:w-1/2'>
                            <div className='flex flex-col gap-2 w-full'>
                                {order.items.map((item, idx) => (
                                    <div key={idx} className='flex items-start gap-4'>
                                        <img className='h-24 w-20 rounded-xl object-cover sm:h-28 sm:w-24' src={item.image} alt={item.name} />
                                        <div className='flex-1'>
                                            <p className='sm:text-base font-medium'>{item.name}</p>
                                            <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                                                <p className='text-lg'>{currency}{item.price}</p>
                                                <p>Quantity: {item.quantity}</p>
                                                <p>Size: {item.size}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className='mt-2 text-sm'>
                                    <p className='font-medium'>Total: {currency}{order.amount}</p>
                                    <p className='text-gray-500'>Payment: {order.paymentMethod} {order.payment ? '(Paid)' : '(Pending)'}</p>
                                    <p>Date: <span className='text-gray-400'>{new Date(order.date).toLocaleDateString()}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Order Status & Actions */}
                        <div className='md:w-1/2 flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <p className={`min-w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></p>
                                <p className='text-sm md:text-base'>{order.status}</p>
                            </div>
                            
                            <button 
                                onClick={fetchOrders}
                                className='rounded-full border border-[#1d1a17] px-5 py-2 text-xs font-semibold uppercase tracking-wider transition hover:bg-[#1d1a17] hover:text-white'
                            >
                                Track Order
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    </main>
  )
}

export default Orders
