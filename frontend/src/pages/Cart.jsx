import React, { useContext, useEffect, useState } from 'react'
import ShopContext from '../context/ShopContext.js'
import { assets } from '../assets/frontend_assets/assets';
import CartTotal from '../components/CartTotal';
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products])

  return (
    <main className='page-shell page-pad page-enter'>

      <div className='mb-10'>
        <p className='eyebrow'>Your selection</p>
        <h1 className='editorial-title mt-3'>Shopping bag</h1>
      </div>

      <div>
        {
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);

            return (
              <div key={index} className='mb-4 grid grid-cols-[4fr_0.5fr_0.5fr] items-center gap-4 rounded-2xl border border-[#ded7cc] bg-[#fffdf9] p-4 text-[#4f4943] sm:grid-cols-[4fr_2fr_0.5fr]'>
                
                {/* Product Image & Details */}
                <div className='flex items-start gap-4 sm:gap-6'>
                  <img className='h-24 w-20 rounded-xl object-cover sm:h-28 sm:w-24' src={productData.image[0]} alt={productData.name} />
                  <div>
                    {/* Name: Smaller font on mobile */}
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className='flex items-center gap-3 sm:gap-5 mt-2'>
                      <p className='text-sm sm:text-base'>{currency}{productData.price}</p>
                      {/* Size Badge: Compact on mobile */}
                      <p className='rounded-full border border-[#ded7cc] bg-[#f8f5ef] px-3 py-1 text-xs'>{item.size}</p>
                    </div>
                  </div>
                </div>

                {/* Quantity Input: Smaller width on mobile */}
                <input 
                    onChange={(e)=> e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} 
                    className='max-w-12 rounded-full border px-2 py-2 text-center sm:max-w-20'
                    type="number" 
                    min={1} 
                    defaultValue={item.quantity} 
                />

                {/* Delete Bin Icon: Responsive margin and size */}
                <img 
                    onClick={()=>updateQuantity(item._id, item.size, 0)} 
                    className='w-4 mr-4 sm:w-5 cursor-pointer hover:scale-110 transition-transform' 
                    src={assets.bin_icon} 
                    alt="Remove" 
                />
              </div>
            )
          })
        }
      </div>

      {/* Cart Totals Section */}
      <div className='my-16 flex justify-end'>
        {/* Full width on mobile, fixed width on Desktop */}
        <div className='w-full sm:w-[450px]'>
            <CartTotal />
            <div className='w-full text-end'>
                <button 
                  onClick={()=>navigate('/place-order')} 
                  className='fashion-button my-8 w-full sm:w-auto'
                >
                    PROCEED TO CHECKOUT
                </button>
            </div>
        </div>
      </div>

    </main>
  )
}

export default Cart
