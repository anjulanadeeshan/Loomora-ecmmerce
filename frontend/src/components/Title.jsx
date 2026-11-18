import React from 'react'

const Title = ({text1, text2}) => {
  return (
    <div className='mb-4'>
      <p className='eyebrow mb-3'>{text1}</p>
      <h2 className='display-font text-4xl leading-none text-[#1d1a17] sm:text-5xl md:text-6xl'>{text2.trim()}</h2>
    </div>
  )
}

export default Title
