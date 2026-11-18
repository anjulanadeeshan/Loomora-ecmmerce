import React, { useContext } from 'react'
import ShopContext from '../context/ShopContext.js'

const CartTotal = () => {
    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  return (
    <div className='surface-card w-full p-6 sm:p-8'>
        <div>
            <p className='eyebrow'>Order summary</p>
            <h2 className='display-font mt-2 text-3xl'>Cart totals</h2>
        </div>

        <div className='mt-6 flex flex-col gap-3 text-sm text-[#5f5851]'>
            <div className='flex justify-between'>
                <p>Subtotal</p>
                <p>{currency} {getCartAmount()}.00</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p>{currency} {delivery_fee}.00</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <b>Total</b>
                <b>{currency} {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</b>
            </div>
        </div>
    </div>
  )
}

export default CartTotal
