const PasswordVisibilityButton = ({ visible, onToggle, label = 'password' }) => (
  <button
    type='button'
    onClick={onToggle}
    className='absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-[#746d65] transition hover:text-[#7d263d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7d263d]'
    aria-label={`${visible ? 'Hide' : 'Show'} ${label}`}
    aria-pressed={visible}
    title={`${visible ? 'Hide' : 'Show'} ${label}`}
  >
    {visible ? (
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.7' className='h-5 w-5' aria-hidden='true'>
        <path d='m3 3 18 18' strokeLinecap='round' />
        <path d='M10.6 10.7a2 2 0 0 0 2.7 2.7' strokeLinecap='round' />
        <path d='M9.9 4.2A10.7 10.7 0 0 1 12 4c5.5 0 9 5.2 9 5.2a14.7 14.7 0 0 1-2.2 2.7M6.6 6.6C4.4 8 3 10.2 3 10.2S6.5 16 12 16c1 0 2-.2 2.9-.5' strokeLinecap='round' strokeLinejoin='round' />
      </svg>
    ) : (
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.7' className='h-5 w-5' aria-hidden='true'>
        <path d='M3 12s3.5-5.8 9-5.8 9 5.8 9 5.8-3.5 5.8-9 5.8S3 12 3 12Z' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='12' cy='12' r='2.4' />
      </svg>
    )}
  </button>
)

export default PasswordVisibilityButton
