import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsLetter from '../components/NewsLetter'
import FeedbackSection from '../components/FeedbackSection'

const Home = () => {
  return (
    <div className='page-enter'>
      <Hero/>
      <div className='page-shell'>
        <LatestCollection/>
        <BestSeller/>
        <OurPolicy/>
        <FeedbackSection/>
        <NewsLetter/>
      </div>
    </div>
  )
}

export default Home
