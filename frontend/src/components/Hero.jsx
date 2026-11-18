import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/frontend_assets/assets'

const Hero = () => {
  const navigate = useNavigate()
  const editHighlights = [
    'New arrivals',
    'Everyday tailoring',
    'After-dark statements',
    'Modern essentials',
    'Layers with intent'
  ]

  const handleEditHighlight = (highlight) => {
    if (highlight === 'New arrivals') {
      document.querySelector('#latest-collection')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      return
    }

    navigate('/collection')
  }

  return (
    <section className='relative isolate min-h-[720px] overflow-hidden bg-[#211619] text-white sm:min-h-[760px] lg:min-h-screen'>
      <img
        src={assets.hero_img}
        alt='The latest Loomora fashion collection'
        className='absolute inset-0 h-full w-full object-cover object-[48%_center]'
      />
      <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(20,12,14,0.90)_0%,rgba(30,15,20,0.72)_40%,rgba(37,18,23,0.46)_68%,rgba(20,12,14,0.64)_100%)]' />
      <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(12,9,10,0.58)_0%,transparent_24%,transparent_66%,rgba(12,9,10,0.78)_100%)]' />
      <div className='absolute inset-0 bg-[#7d263d]/20 mix-blend-multiply' />

      <div className='page-shell relative z-10 flex min-h-[720px] flex-col justify-between pb-7 pt-36 sm:min-h-[760px] sm:pb-9 sm:pt-40 lg:min-h-screen lg:pt-44'>
        <div className='grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.65fr)]'>
          <div className='max-w-3xl'>
            <button
              type='button'
              onClick={() => handleEditHighlight('New arrivals')}
              className='group mb-7 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 transition hover:text-white'
            >
              <span>The 2026 edit</span>
              <span className='text-base text-[#ff6b9a] transition-transform duration-200 group-hover:translate-x-1' aria-hidden='true'>→</span>
            </button>

            <h1 className='max-w-3xl text-[3.25rem] font-semibold leading-[0.96] tracking-[-0.055em] sm:text-[4.75rem] lg:text-[5.6rem] xl:text-[6.25rem]'>
              Dress the moment.
              <span className='display-font mt-1 block font-normal italic text-[#ffc0d1]'>Own the room.</span>
            </h1>

            <p className='mt-6 max-w-xl text-sm leading-7 text-white/75 sm:text-base lg:text-lg'>
              Expressive colour, confident tailoring and elevated essentials—curated for a wardrobe that feels unmistakably yours.
            </p>

            <div className='mt-8 flex flex-wrap gap-3'>
              <button
                type='button'
                onClick={() => navigate('/collection')}
                className='fashion-button fashion-button-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent'
              >
                Shop the edit
              </button>
              <button
                type='button'
                onClick={() => navigate('/about')}
                className='fashion-button fashion-button-outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent'
              >
                Discover Loomora
              </button>
            </div>
          </div>

          <div className='hidden justify-self-end lg:block'>
            <p className='mb-5 text-[10px] font-bold uppercase tracking-[0.24em] text-white/50'>Explore the edit</p>
            <div className='space-y-4'>
              {editHighlights.map((highlight) => (
                <button
                  key={highlight}
                  type='button'
                  onClick={() => handleEditHighlight(highlight)}
                  className='group flex items-center gap-4 text-left text-2xl font-semibold tracking-[-0.035em] text-white/35 transition hover:text-white focus-visible:text-white focus-visible:outline-none xl:text-[1.75rem]'
                >
                  <span className='text-sm text-[#ff4f8b] opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100' aria-hidden='true'>▶</span>
                  {highlight}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4 border-t border-white/20 pt-5 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-xs font-medium text-white/65'>Designed for every chapter of your style story.</p>
          <div className='flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45 sm:justify-end'>
            <span>Expressive colour</span>
            <span>Modern tailoring</span>
            <span>Everyday ease</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
