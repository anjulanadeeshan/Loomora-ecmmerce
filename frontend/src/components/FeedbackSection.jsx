import React, { useEffect, useState } from 'react';
import api from '../config/api';
import { assets } from '../assets/frontend_assets/assets';

const FeedbackSection = () => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    api.get('/api/feedback/approved')
      .then((response) => {
        if (response.data.success) setFeedback(response.data.feedback);
      })
      .catch(() => {});
  }, []);

  const samples = [
    { name: 'Amelia Grace', message: 'The fit and finish are exceptional. The pieces feel elevated, but still effortless to wear.', profilePicture: assets.feedback_avatar_1 },
    { name: 'Noah Bennett', message: 'A smooth shopping experience with thoughtful styling choices and easy everyday pieces.', profilePicture: assets.feedback_avatar_2 },
    { name: 'Sophia Reed', message: 'The quality and details make every outfit feel considered from the moment it arrives.', profilePicture: assets.feedback_avatar_3 }
  ];

  const entries = feedback.length > 0 ? feedback : samples;

  return (
    <section className='pt-6 sm:pt-8 pb-16 sm:pb-24'>
      <div className='mb-10 max-w-2xl'>
        <p className='eyebrow mb-4'>From the Loomora community</p>
        <h2 className='editorial-title'>Loved in real life.</h2>
      </div>
      <div className='grid gap-5 md:grid-cols-3'>
        {entries.map((item, index) => (
          <article key={item._id || index} className='surface-card p-7 sm:p-8'>
            <div className='mb-5 flex items-center gap-4'>
              <img
                src={item.profilePicture || samples[index % samples.length].profilePicture}
                alt={item.name}
                className='h-14 w-14 rounded-full object-cover'
              />
              <div>
                <h3 className='font-bold text-[#1d1a17]'>{item.name}</h3>
                <p className='mt-1 text-sm text-[#b4935f]' aria-label={`${item.rating || 5} out of 5 stars`}>
                  {'★'.repeat(item.rating || 5)}
                </p>
              </div>
            </div>
            <p className='text-sm leading-7 text-[#746d65]'>“{item.message}”</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeedbackSection;
