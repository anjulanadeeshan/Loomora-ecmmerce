import React, { useContext, useEffect, useRef } from 'react'
import ShopContext from '../context/ShopContext.js'

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const inputRef = useRef(null);
    const suggestions = ['Cotton', 'Jacket', 'Trousers'];

    useEffect(() => {
        if (showSearch) {
            inputRef.current?.focus();
        }
    }, [showSearch])

    return showSearch ? (
        <div className='w-full'>
            <div className='flex w-full items-center gap-2.5 rounded-full border border-[#ded7cc] bg-white/95 px-4 py-2.5 shadow-[0_10px_25px_rgba(42,34,29,0.08)] backdrop-blur'>
                <svg className='h-4 w-4 shrink-0 text-[#746d65]' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
                    <circle cx='11' cy='11' r='7' />
                    <path d='m20 20-4-4' />
                </svg>
                <input
                    ref={inputRef}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='min-w-0 flex-1 border-0 !bg-transparent p-0 text-xs text-[#1d1a17] outline-none placeholder:text-[#746d65]/70 focus:!shadow-none sm:text-sm'
                    type='search'
                    placeholder='Search dresses, jackets, cotton...'
                    aria-label='Search the collection'
                />
                {search && (
                    <button
                        type='button'
                        onClick={() => setSearch('')}
                        className='shrink-0 text-[11px] font-semibold uppercase tracking-wider text-[#746d65] transition hover:text-[#7d263d]'
                        aria-label='Clear search'
                    >
                        Clear
                    </button>
                )}
                <button
                    type='button'
                    onClick={() => setShowSearch(false)}
                    className='ml-1 grid h-6 w-6 shrink-0 place-items-center rounded-full text-base font-light text-[#746d65] transition hover:bg-[#ded7cc]/50 hover:text-[#1d1a17]'
                    aria-label='Close search'
                    title='Close search'
                >
                    ×
                </button>
            </div>

            <div className='mt-2.5 flex flex-wrap items-center gap-2' aria-label='Suggested searches'>
                <span className='text-[10px] font-semibold uppercase tracking-wider text-[#8c847b]'>Suggestions:</span>
                {suggestions.map((suggestion) => (
                    <button
                        key={suggestion}
                        type='button'
                        onClick={() => setSearch(suggestion)}
                        className='inline-flex items-center gap-1.5 rounded-full border border-[#ded7cc]/80 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[#5f5851] transition hover:border-[#7d263d] hover:bg-white hover:text-[#7d263d]'
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    ) : null
}

export default SearchBar
