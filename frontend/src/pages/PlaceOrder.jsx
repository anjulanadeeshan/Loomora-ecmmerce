import React, { useContext, useState } from 'react'
import ShopContext from '../context/ShopContext.js'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/frontend_assets/assets'
import { useNavigate } from 'react-router-dom'
import { placeOrder } from '../services/orderService'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const { cartItems, products, getCartAmount, navigate } = useContext(ShopContext);
  const navigation = useNavigate();
  
  const [method, setMethod] = useState('cod');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      // Validate form
      if (!formData.firstName || !formData.email || !formData.street || !formData.city) {
        toast.error('Please fill all required fields');
        setLoading(false);
        return;
      }

      // Get user data
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        toast.error('Please login to place an order');
        navigate('/login');
        return;
      }

      // Prepare order items from cart
      const orderItems = [];
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const product = products.find(p => p._id === itemId);
            if (product) {
              orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItems[itemId][size],
                size: size,
                image: product.image[0]
              });
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error('Your cart is empty');
        setLoading(false);
        return;
      }

      // Prepare order data
      const orderData = {
        userId: user.id,
        items: orderItems,
        amount: getCartAmount() + 10, // Including delivery fee
        address: formData,
        paymentMethod: method.toUpperCase()
      };

      // Place order
      const response = await placeOrder(orderData);

      if (response.success) {
        toast.success('Order placed successfully!');
        // Clear cart (you may need to implement this in context)
        navigation('/orders');
      } else {
        toast.error(response.message || 'Failed to place order');
      }

      setLoading(false);
    } catch (error) {
      console.error('Place order error:', error);
      toast.error('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className='page-shell page-pad page-enter flex min-h-[80vh] flex-col justify-between gap-8 lg:flex-row lg:gap-14'>
      
      {/* ------------- Left Side: Delivery Information ------------- */}
      <div className='surface-card flex w-full flex-col gap-4 p-6 sm:max-w-[540px] sm:p-9'>
      
        <div className='my-3'>
          <p className='eyebrow'>Where should we send it?</p>
          <h1 className='display-font mt-2 text-4xl'>Delivery information</h1>
        </div>

        <div className='flex gap-3'>
            <input 
              className='w-full rounded-xl border px-4 py-3'
              type="text" 
              name="firstName"
              placeholder='First name'
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input 
              className='w-full rounded-xl border px-4 py-3'
              type="text" 
              name="lastName"
              placeholder='Last name'
              value={formData.lastName}
              onChange={handleChange}
              required
            />
        </div>
        <input 
          className='w-full rounded-xl border px-4 py-3'
          type="email" 
          name="email"
          placeholder='Email address'
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input 
          className='w-full rounded-xl border px-4 py-3'
          type="text" 
          name="street"
          placeholder='Street'
          value={formData.street}
          onChange={handleChange}
          required
        />
        
        <div className='flex gap-3'>
            <input 
              className='w-full rounded-xl border px-4 py-3'
              type="text" 
              name="city"
              placeholder='City'
              value={formData.city}
              onChange={handleChange}
              required
            />
            <input 
              className='w-full rounded-xl border px-4 py-3'
              type="text" 
              name="state"
              placeholder='State'
              value={formData.state}
              onChange={handleChange}
            />
        </div>
        
        <div className='flex gap-3'>
            <input 
              className='w-full rounded-xl border px-4 py-3'
              type="text" 
              name="zipcode"
              placeholder='Zipcode'
              value={formData.zipcode}
              onChange={handleChange}
            />
            <input 
              className='w-full rounded-xl border px-4 py-3'
              type="text" 
              name="country"
              placeholder='Country'
              value={formData.country}
              onChange={handleChange}
            />
        </div>
        
        <input 
          className='w-full rounded-xl border px-4 py-3'
          type="tel" 
          name="phone"
          placeholder='Phone'
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      {/* ------------- Right Side: Cart Total & Payment ------------- */}
      <div className='mt-8 w-full lg:max-w-[520px]'>
        
        <div className='mt-8 min-w-80'>
            <CartTotal />
        </div>

        <div className='surface-card mt-6 p-6 sm:p-8'>
            <div className='my-3'>
              <p className='eyebrow'>Secure checkout</p>
              <h2 className='display-font mt-2 text-3xl'>Payment method</h2>
            </div>

            {/* Payment Method Selection */}
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                
                {/* Stripe */}
                <div onClick={()=>setMethod('stripe')} className={`flex h-16 cursor-pointer items-center justify-center gap-2.5 rounded-xl border px-3 transition sm:h-20 ${method === 'stripe' ? 'border-[#7d263d] bg-[#f7edf0]' : 'border-[#ded7cc]'}`}>
                    <span className={`h-3.5 min-w-3.5 rounded-full border ${method === 'stripe' ? 'border-[#7d263d] bg-[#7d263d]' : ''}`}></span>
                    <img className='h-5 max-w-[72px] object-contain' src={assets.stripe_logo} alt="Stripe" />
                </div>

                {/* Razorpay */}
                <div onClick={()=>setMethod('razorpay')} className={`flex h-16 cursor-pointer items-center justify-center gap-2.5 rounded-xl border px-3 transition sm:h-20 ${method === 'razorpay' ? 'border-[#7d263d] bg-[#f7edf0]' : 'border-[#ded7cc]'}`}>
                    <span className={`h-3.5 min-w-3.5 rounded-full border ${method === 'razorpay' ? 'border-[#7d263d] bg-[#7d263d]' : ''}`}></span>
                    <img className='h-5 max-w-[72px] object-contain' src={assets.razorpay_logo} alt="Razorpay" />
                </div>

                {/* Cash on Delivery */}
                <div onClick={()=>setMethod('cod')} className={`flex h-16 cursor-pointer items-center justify-center gap-2.5 rounded-xl border px-3 text-center transition sm:h-20 ${method === 'cod' ? 'border-[#7d263d] bg-[#f7edf0]' : 'border-[#ded7cc]'}`}>
                    <span className={`h-3.5 min-w-3.5 rounded-full border ${method === 'cod' ? 'border-[#7d263d] bg-[#7d263d]' : ''}`}></span>
                    <span className='text-xs font-semibold text-gray-500 sm:leading-5'>CASH ON<br className='hidden sm:block' /> DELIVERY</span>
                </div>

            </div>

            <div className='w-full text-end mt-8'>
                <button 
                  onClick={handlePlaceOrder} 
                  disabled={loading}
                  className='fashion-button w-full disabled:cursor-not-allowed disabled:opacity-50'
                >
                    {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
                </button>
            </div>
        </div>
      </div>
    </main>
  )
}

export default PlaceOrder
