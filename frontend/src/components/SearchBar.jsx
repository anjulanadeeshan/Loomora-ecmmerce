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
        <div className='mt-7 max-w-2xl'>
            <div className='flex w-full items-center gap-3 rounded-full border border-[#ded7cc] bg-white/90 px-5 py-3.5 shadow-[0_16px_40px_rgba(42,34,29,0.12)] backdrop-blur'>
                <svg className='h-5 w-5 shrink-0 text-[#746d65]' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
                    <circle cx='11' cy='11' r='7' />
                    <path d='m20 20-4-4' />
                </svg>
                <input
                    ref={inputRef}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='min-w-0 flex-1 border-0 !bg-transparent p-0 text-sm text-[#1d1a17] outline-none placeholder:text-[#746d65]/70 focus:!shadow-none sm:text-base'
                    type='search'
                    placeholder='Search dresses, jackets, cotton...'
                    aria-label='Search the collection'
                />
                {search && (
                    <button
                        type='button'
                        onClick={() => setSearch('')}
                        className='shrink-0 text-xs font-semibold uppercase tracking-wider text-[#746d65] transition hover:text-[#7d263d]'
                        aria-label='Clear search'
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className='mt-4 flex flex-wrap gap-2.5' aria-label='Suggested searches'>
                {suggestions.map((suggestion) => (
                    <button
                        key={suggestion}
                        type='button'
                        onClick={() => setSearch(suggestion)}
                        className='inline-flex items-center gap-2 rounded-full border border-[#ded7cc] bg-white/70 px-4 py-2 text-xs font-medium text-[#5f5851] backdrop-blur transition hover:border-[#7d263d] hover:bg-white hover:text-[#7d263d]'
                    >
                        <svg className='h-3.5 w-3.5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
                            <circle cx='11' cy='11' r='7' />
                            <path d='m20 20-4-4' />
                        </svg>
                        {suggestion}
                    </button>
                ))}
            </div>

            <button
                type='button'
                onClick={() => setShowSearch(false)}
                className='mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#746d65] transition hover:text-[#7d263d]'
                aria-label='Close search'
            >
                Close search
            </button>
        </div>
    ) : null
}

export default SearchBar
