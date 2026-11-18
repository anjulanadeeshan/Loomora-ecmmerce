import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const OurPolicy = () => {
  return (
    <section className='pt-16 sm:pt-20 lg:pt-24 pb-6 sm:pb-8'>
      <div className='mb-12 max-w-2xl'>
        <p className='eyebrow mb-4'>The Loomora promise</p>
        <h2 className='editorial-title text-[#1d1a17]'>Beautifully simple, from click to closet.</h2>
      </div>

      <div className='grid gap-5 md:grid-cols-3'>
        {[
          { icon: assets.exchange_icon, number: '01', title: 'Easy exchanges', copy: 'A considered fit should feel effortless. Exchange eligible pieces within 30 days.' },
          { icon: assets.quality_icon, number: '02', title: 'Curated quality', copy: 'Every Loomora piece is selected for its fabrication, finish and lasting appeal.' },
          { icon: assets.support_img, number: '03', title: 'Personal support', copy: 'Our style team is here whenever you need sizing, styling or order guidance.' }
        ].map((item) => (
          <article key={item.title} className='surface-card group p-7 transition duration-300 hover:-translate-y-1 hover:border-[#b4935f] sm:p-9'>
            <div className='flex items-center justify-between'>
              <span className='grid h-12 w-12 place-items-center rounded-full bg-[#f1ebe2]'>
                <img src={item.icon} alt="" className='h-6 w-6 object-contain' />
              </span>
              <span className='display-font text-2xl text-[#b4935f]'>{item.number}</span>
            </div>
            <h3 className='display-font mt-10 text-3xl font-medium text-[#1d1a17]'>{item.title}</h3>
            <p className='mt-4 text-sm leading-7 text-[#5f5851]'>{item.copy}</p>
          </article>
        ))}
      </div>

      <div className='mt-12 grid grid-cols-2 border-y border-[#ded7cc] py-8 md:grid-cols-4'>
        {[
          ['50K+', 'Happy customers'],
          ['99%', 'Satisfaction'],
          ['24/7', 'Style support'],
          ['500+', 'Curated labels']
        ].map(([value, label]) => (
          <div key={label} className='border-[#ded7cc] px-4 py-4 text-center md:border-r md:last:border-r-0'>
            <p className='display-font text-4xl text-[#7d263d]'>{value}</p>
            <p className='mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#746d65]'>{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default OurPolicy
