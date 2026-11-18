import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className='page-shell page-enter pt-[92px]'>
      <div className='grid min-h-[calc(100vh-110px)] overflow-hidden rounded-[2rem] border border-[#ded7cc] bg-[#eee7dc] lg:grid-cols-[0.88fr_1.12fr]'>
        <div className='relative z-10 flex flex-col justify-center px-7 py-16 sm:px-12 lg:px-16 xl:px-20'>
          <div className='mb-8 flex items-center gap-4'>
            <span className='h-px w-10 bg-[#7d263d]'></span>
            <span className='eyebrow'>The 2026 edit</span>
          </div>
          <h1 className='editorial-title max-w-2xl text-[#1d1a17]'>
            Wear the
            <span className='block italic text-[#7d263d]'>moment.</span>
          </h1>
          <p className='mt-7 max-w-lg text-sm leading-7 text-[#746d65] sm:text-base'>
            Considered silhouettes, expressive colour and elevated essentials—curated for a wardrobe that feels entirely your own.
          </p>
          <div className='mt-10 flex flex-wrap items-center gap-5'>
            <button onClick={() => navigate('/collection')} className='fashion-button'>Explore the collection</button>
            <button onClick={() => navigate('/about')} className='text-xs font-bold uppercase tracking-[0.16em] text-[#1d1a17] underline decoration-[#b4935f] underline-offset-8'>Our story</button>
          </div>
          <div className='mt-16 flex gap-10 border-t border-[#d2c8ba] pt-6 text-xs uppercase tracking-[0.12em] text-[#746d65]'>
            <span>Curated quality</span>
            <span>Worldwide style</span>
          </div>
        </div>

        <div className='relative min-h-[58vh] lg:min-h-full'>
          <img src={assets.hero_img} alt="Loomora brand-new arrival" className='absolute inset-0 h-full w-full object-cover object-center' />
          <div className='absolute inset-0 bg-gradient-to-t from-[#1d1a17]/35 via-transparent to-transparent'></div>
          <div className='absolute bottom-6 left-6 right-6 flex items-end justify-between text-white sm:bottom-10 sm:left-10 sm:right-10'>
            <div>
              <p className='text-[10px] font-bold uppercase tracking-[0.24em] text-white/75'>New arrival</p>
              <p className='display-font mt-1 text-3xl sm:text-4xl'>Soft structure</p>
            </div>
            <span className='grid h-14 w-14 place-items-center rounded-full border border-white/60 bg-white/10 text-xl backdrop-blur'>↗</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
