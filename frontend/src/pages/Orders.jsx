import React, { useCallback, useContext, useEffect, useState } from 'react'
import ShopContext from '../context/ShopContext.js'
import { getUserOrders } from '../services/orderService'
import { toast } from 'react-toastify'
import api from '../config/api'

const Orders = () => {

  const { currency, user } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [feedbackOrderId, setFeedbackOrderId] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

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

  const statusSteps = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered'];

  const trackOrder = async (orderId) => {
    if (trackingOrderId === orderId) {
      setTrackingOrderId(null);
      return;
    }

    setTrackingLoading(true);
    try {
      const response = await getUserOrders(user.id);
      if (response.success) {
        setOrders(response.orders);
        setTrackingOrderId(orderId);
      } else {
        toast.error(response.message || 'Unable to refresh order status');
      }
    } catch (error) {
      toast.error('Unable to refresh order status');
    } finally {
      setTrackingLoading(false);
    }
  };

  const submitFeedback = async (orderId) => {
    if (!feedbackMessage.trim()) {
      toast.error('Please write a feedback message');
      return;
    }
    setFeedbackLoading(true);
    try {
      const response = await api.post('/api/feedback/add', {
        orderId,
        rating: feedbackRating,
        message: feedbackMessage.trim()
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setFeedbackOrderId(null);
        setFeedbackMessage('');
        setFeedbackRating(5);
      } else {
        toast.error(response.data.message || 'Unable to submit feedback');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to submit feedback');
    } finally {
      setFeedbackLoading(false);
    }
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
                    <div key={order._id} className='surface-card mb-5 flex flex-col gap-5 p-5 text-[#4f4943] md:flex-row md:flex-wrap md:items-center md:justify-between sm:p-7'>
                        
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
                        <div className='flex w-full flex-col items-start gap-4 md:w-1/2 md:flex-row md:items-center md:justify-end'>
                            <div className='flex items-center gap-2'>
                                <p className={`min-w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></p>
                                <p className='text-sm md:text-base'>{order.status}</p>
                            </div>

                            <div className='flex flex-wrap items-center gap-3'>
                                <button
                                    onClick={() => trackOrder(order._id)}
                                    aria-expanded={trackingOrderId === order._id}
                                    disabled={trackingLoading}
                                    className='rounded-full border border-[#1d1a17] px-5 py-2 text-xs font-semibold uppercase tracking-wider transition hover:bg-[#1d1a17] hover:text-white'
                                >
                                    {trackingLoading && trackingOrderId !== order._id ? 'Checking...' : trackingOrderId === order._id ? 'Hide Tracking' : 'Track Order'}
                                </button>
                                {order.status === 'Delivered' && (
                                    <button
                                        type='button'
                                        onClick={() => setFeedbackOrderId(feedbackOrderId === order._id ? null : order._id)}
                                        className='rounded-full border border-[#7d263d] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#7d263d] transition hover:bg-[#7d263d] hover:text-white'
                                    >
                                        {feedbackOrderId === order._id ? 'Close Feedback' : 'Add Feedback'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {trackingOrderId === order._id && (
                            <div className='w-full border-t border-[#ded7cc] pt-6'>
                                <p className='mb-5 text-xs font-bold uppercase tracking-[0.14em] text-[#7d263d]'>Delivery progress</p>
                                <ol className='grid grid-cols-2 gap-y-6 sm:grid-cols-5' aria-label={`Tracking progress for order ${order._id}`}>
                                    {statusSteps.map((step, index) => {
                                        const currentIndex = statusSteps.indexOf(order.status);
                                        const isComplete = currentIndex >= index;
                                        const isCurrent = currentIndex === index;

                                        return (
                                            <li key={step} className='relative'>
                                                {index < statusSteps.length - 1 && (
                                                    <span className={`absolute left-6 top-3 hidden h-px w-[calc(100%-1.5rem)] sm:block ${isComplete ? 'bg-[#7d263d]' : 'bg-[#ded7cc]'}`} />
                                                )}
                                                <div className='relative z-10 flex items-center gap-2 sm:flex-col sm:items-start'>
                                                    <span className={`grid h-6 w-6 place-items-center rounded-full border text-[10px] font-bold ${isComplete ? 'border-[#7d263d] bg-[#7d263d] text-white' : 'border-[#ded7cc] bg-white text-[#746d65]'}`}>
                                                        {isComplete ? '✓' : index + 1}
                                                    </span>
                                                    <span className={`text-xs ${isCurrent ? 'font-bold text-[#7d263d]' : isComplete ? 'font-medium text-[#1d1a17]' : 'text-[#8c847b]'}`}>
                                                        {step}
                                                    </span>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ol>
                            </div>
                        )}

                        {feedbackOrderId === order._id && (
                            <div className='w-full rounded-2xl border border-[#ded7cc] bg-[#fffdf9] p-5'>
                                <p className='mb-4 text-sm font-bold text-[#1d1a17]'>Share feedback for this order</p>
                                <div className='mb-4 flex gap-2' aria-label='Rating'>
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            type='button'
                                            onClick={() => setFeedbackRating(rating)}
                                            className={`text-2xl transition ${rating <= feedbackRating ? 'text-[#b4935f]' : 'text-[#ded7cc]'}`}
                                            aria-label={`${rating} stars`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={feedbackMessage}
                                    onChange={(event) => setFeedbackMessage(event.target.value)}
                                    maxLength={500}
                                    rows={4}
                                    className='w-full resize-none rounded-xl border px-4 py-3 text-sm'
                                    placeholder='Tell us about your Loomora experience'
                                />
                                <button
                                    type='button'
                                    onClick={() => submitFeedback(order._id)}
                                    disabled={feedbackLoading}
                                    className='fashion-button mt-4'
                                >
                                    {feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    </main>
  )
}

export default Orders
