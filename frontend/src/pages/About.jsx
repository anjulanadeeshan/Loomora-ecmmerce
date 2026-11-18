import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetter from '../components/NewsLetter'

const About = () => {
  return (
    <main className="min-h-screen page-enter">

      {/* ----------------- Hero Section ----------------- */}
      <div className='page-shell relative mt-[92px] h-[540px] overflow-hidden rounded-[2rem]'>
        <div className='absolute inset-0 z-10 bg-gradient-to-t from-[#1d1a17]/80 via-[#1d1a17]/20 to-transparent'></div>
        <img 
          className='absolute inset-0 w-full h-full object-cover object-center' 
          src={assets.couple_img} 
          alt="About Loomora"
        />
        <div className='relative z-20 flex h-full flex-col items-center justify-end px-6 pb-14 text-center text-white sm:pb-20'>
          <p className='mb-5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#dfbd91]'>Behind the label</p>
          <h1 className='display-font mb-5 text-6xl md:text-8xl'>Our Story</h1>
          <p className='max-w-2xl text-base font-light leading-relaxed text-white/80 md:text-lg'>
            Redefining fashion retail through style, innovation, and unwavering commitment to excellence
          </p>
        </div>
      </div>

      {/* ----------------- About Us Section ----------------- */}
      <div className='page-shell section-space'>
        
        <div className='max-w-7xl mx-auto'>
          <div className='grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20'>
            
            <div className='relative group'>
              <div className='absolute -inset-3 rounded-[2rem] border border-[#b4935f]/40'></div>
              <img 
                className='relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-2xl transition duration-500 group-hover:scale-[1.01]'
                src={assets.about_img} 
                alt="About Loomora"
              />
            </div>

            <div className='flex flex-col gap-8 text-gray-600'>
              <div>
                <p className='eyebrow mb-4'>Created with intention</p>
                <h2 className='display-font mb-6 text-5xl text-[#1d1a17]'>The Loomora Journey</h2>
                <p className='text-lg leading-relaxed mb-4'>
                  Loomora emerged from a vision to redefine online fashion retail by blending style, quality, and accessibility. Founded by a team of fashion enthusiasts and tech innovators, we set out to create more than just a store – we built a destination where modern shoppers discover their unique style effortlessly.
                </p>
                <p className='text-lg leading-relaxed'>
                  What started as a boutique collection has evolved into a comprehensive fashion marketplace. We partner directly with emerging designers and established brands worldwide, ensuring every piece meets our rigorous standards for quality, sustainability, and contemporary design.
                </p>
              </div>
              
              <div className='rounded-[1.5rem] bg-[#681f34] p-8 text-white shadow-xl'>
                <h3 className='display-font mb-4 text-3xl'>Our Mission</h3>
                <p className='leading-relaxed text-white/75'>
                  We exist to inspire confidence through fashion. Our commitment extends beyond transactions – we're building a community where personal style flourishes, sustainable choices matter, and every customer feels valued from first click to final delivery.
                </p>
              </div>
            </div>

          </div>

          {/* ----------------- Stats Section ----------------- */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-20'>
            <div className='surface-card p-8 text-center'>
              <h3 className='display-font mb-2 text-4xl text-[#7d263d]'>50K+</h3>
              <p className='text-gray-600 font-medium'>Happy Customers</p>
            </div>
            <div className='surface-card p-8 text-center'>
              <h3 className='display-font mb-2 text-4xl text-[#7d263d]'>5K+</h3>
              <p className='text-gray-600 font-medium'>Products</p>
            </div>
            <div className='surface-card p-8 text-center'>
              <h3 className='display-font mb-2 text-4xl text-[#7d263d]'>100+</h3>
              <p className='text-gray-600 font-medium'>Brands</p>
            </div>
            <div className='surface-card p-8 text-center'>
              <h3 className='display-font mb-2 text-4xl text-[#7d263d]'>99%</h3>
              <p className='text-gray-600 font-medium'>Satisfaction Rate</p>
            </div>
          </div>

        </div>
      </div>

      {/* ----------------- Why Choose Us Section ----------------- */}
      <div className='page-shell pb-20'>
        
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <p className='eyebrow mb-4'>Why Loomora</p>
            <h2 className='display-font mb-4 text-5xl text-[#1d1a17] md:text-6xl'>Details make the difference.</h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Experience the perfect blend of quality, convenience, and exceptional service</p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            
            <div className='surface-card p-8 transition duration-300 hover:-translate-y-1'>
              <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#7d263d] shadow-lg'>
                <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                </svg>
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>Quality Assurance</h3>
              <p className='text-gray-600 leading-relaxed'>
                Every item undergoes rigorous quality checks and material verification. We stand behind each product with confidence, ensuring premium craftsmanship in every piece we offer.
              </p>
            </div>

            <div className='surface-card p-8 transition duration-300 hover:-translate-y-1'>
              <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#7d263d] shadow-lg'>
                <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z' />
                </svg>
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>Convenience</h3>
              <p className='text-gray-600 leading-relaxed'>
                Experience seamless shopping with smart filters, personalized recommendations, and express checkout. Your perfect outfit is just a few clicks away, delivered right to your doorstep.
              </p>
            </div>

            <div className='surface-card p-8 transition duration-300 hover:-translate-y-1'>
              <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#7d263d] shadow-lg'>
                <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z' clipRule='evenodd' />
                </svg>
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>Exceptional Service</h3>
              <p className='text-gray-600 leading-relaxed'>
                Our passionate style experts are available around the clock to help with sizing, styling advice, or any concern. Your complete satisfaction drives everything we do.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ----------------- Newsletter Section ----------------- */}
      <div className='page-shell'><NewsLetter /></div>
      
    </main>
  )
}

export default About
