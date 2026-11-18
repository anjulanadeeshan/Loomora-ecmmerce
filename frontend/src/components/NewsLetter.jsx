import React, { useState } from 'react'

const NewsLetter = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const onSubmitHandler = (event) => {
    event.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      setEmail('')
      setIsSubmitted(false)
    }, 3000)
  }

  return (
    <section className='my-20 overflow-hidden rounded-[2rem] bg-[#681f34] text-white sm:my-28'>
      <div className='grid lg:grid-cols-[0.9fr_1.1fr]'>
        <div className='relative min-h-[280px] overflow-hidden bg-[#4f1728] p-8 sm:p-12 lg:p-16'>
          <div className='absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/15'></div>
          <div className='absolute -bottom-20 -left-20 h-52 w-52 rounded-full border border-white/10'></div>
          <p className='text-[11px] font-bold uppercase tracking-[0.24em] text-[#dfbd91]'>Private notes</p>
          <h2 className='display-font relative mt-7 max-w-xl text-5xl leading-[0.98] sm:text-6xl'>A little more style in your inbox.</h2>
          <p className='relative mt-7 max-w-md text-sm leading-7 text-white/70'>New edits, private offers and thoughtful wardrobe inspiration—sent only when there is something worth sharing.</p>
        </div>

        <div className='flex flex-col justify-center bg-[#fffdf9] p-8 text-[#1d1a17] sm:p-12 lg:p-16'>
          <p className='eyebrow'>Join the Loomora list</p>
          <form onSubmit={onSubmitHandler} className='mt-7'>
            <div className='flex flex-col gap-3 sm:flex-row'>
              <input className='min-h-14 flex-1 rounded-full border px-6 text-sm' type='email' placeholder='Your email address' value={email} onChange={(event) => setEmail(event.target.value)} required />
              <button type='submit' disabled={isSubmitted} className='fashion-button min-w-44 disabled:cursor-not-allowed disabled:opacity-60'>
                {isSubmitted ? 'You are in' : 'Subscribe'}
              </button>
            </div>
          </form>
          <div className='mt-6 flex flex-wrap gap-x-7 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8c847b]'>
            <span>Exclusive access</span>
            <span>No spam</span>
            <span>Unsubscribe anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsLetter
