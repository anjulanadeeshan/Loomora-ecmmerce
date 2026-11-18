import React from 'react'
import NewsLetter from '../components/NewsLetter'
import { assets } from '../assets/frontend_assets/assets'

const Contact = () => {
  return (
    <main className="min-h-screen page-enter">
      
      {/* ----------------- Hero Section with Background Image ----------------- */}
      <div className='page-shell relative mt-[92px] h-[460px] overflow-hidden rounded-[2rem]'>
        <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10'></div>
        <img 
          className='absolute inset-0 w-full h-full object-cover object-center' 
          src={assets.charming_lady} 
          alt="Contact Loomora"
        />
        <div className='relative z-20 flex h-full flex-col justify-end px-7 pb-14 text-white sm:px-12 sm:pb-16'>
          <p className='mb-4 text-[11px] font-bold uppercase tracking-[0.24em] text-[#dfbd91]'>Loomora concierge</p>
          <h1 className='display-font mb-4 text-6xl md:text-7xl'>Get in touch</h1>
          <p className='max-w-xl text-base font-light leading-7 text-white/80 md:text-lg'>We would love to hear from you. Reach out and let us make your Loomora experience exceptional.</p>
        </div>
      </div>

      {/* ----------------- Contact Content ----------------- */}
      <div className='page-shell section-space'>
        
        <div className='max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16'>
          
          {/* Left Side: Contact Form */}
          <div className='surface-card p-8 lg:p-12'>
            <p className='eyebrow mb-3'>Write to us</p>
            <h2 className='display-font mb-8 text-4xl'>Send us a message</h2>
            <form className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Your Name</label>
                <input 
                  type='text' 
                  className='w-full rounded-xl border px-4 py-3'
                  placeholder='John Doe'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                <input 
                  type='email' 
                  className='w-full rounded-xl border px-4 py-3'
                  placeholder='you@example.com'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Phone Number</label>
                <input 
                  type='tel' 
                  className='w-full rounded-xl border px-4 py-3'
                  placeholder='+1 (555) 000-0000'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Your Message</label>
                <textarea 
                  rows='5' 
                  className='w-full resize-none rounded-xl border px-4 py-3'
                  placeholder='Tell us what you need...'
                ></textarea>
              </div>
              <button className='fashion-button w-full'>
                Send Message
              </button>
            </form>
          </div>

          {/* Right Side: Information Cards */}
          <div className='space-y-6'>
            
            {/* Headquarters Card */}
            <div className='rounded-[1.5rem] bg-[#681f34] p-8 text-white shadow-xl'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='bg-white/20 p-3 rounded-full'>
                  <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold'>Our Headquarters</h3>
              </div>
              <p className='text-gray-200 leading-relaxed'>
                1247 Fashion Avenue<br />
                SoHo District, New York<br />
                NY 10012, United States
              </p>
            </div>

            {/* Contact Details Card */}
            <div className='surface-card p-8'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='rounded-full bg-[#7d263d] p-3'>
                  <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-gray-800'>Contact Details</h3>
              </div>
              <div className='space-y-3 text-gray-600'>
                <p className='flex items-center gap-2'>
                  <span className='font-semibold'>Phone:</span>
                  <a href='tel:+16468924100' className='hover:text-black transition-colors'>+1 (646) 892-4100</a>
                </p>
                <p className='flex items-center gap-2'>
                  <span className='font-semibold'>Email:</span>
                  <a href='mailto:support@loomora.com' className='hover:text-black transition-colors'>support@loomora.com</a>
                </p>
                <p className='flex items-center gap-2'>
                  <span className='font-semibold'>Hours:</span>
                  <span>Mon-Fri: 9AM - 6PM EST</span>
                </p>
              </div>
            </div>

            {/* Careers Card */}
            <div className='surface-card p-8'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='rounded-full bg-[#7d263d] p-3'>
                  <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-gray-800'>Join Our Team</h3>
              </div>
              <p className='text-gray-600 mb-6 leading-relaxed'>
                Passionate about fashion and innovation? Explore exciting career opportunities and become part of our growing family.
              </p>
              <button className='fashion-button w-full'>
                View Open Positions →
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ----------------- Newsletter Subscription ----------------- */}
      <div className='page-shell'><NewsLetter /></div>

    </main>
  )
}

export default Contact
