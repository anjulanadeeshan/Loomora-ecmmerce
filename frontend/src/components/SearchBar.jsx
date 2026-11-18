import React, { useContext, useEffect, useState } from 'react'
import ShopContext from '../context/ShopContext.js'
import { assets } from '../assets/frontend_assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const location = useLocation();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true);
        } else {
            setVisible(false);
        }

    }, [location])

    return showSearch && visible ? (
        <div className='relative z-40 mt-[76px] border-b border-[#ded7cc] bg-[#eee7dc]/95 py-5 text-center shadow-[0_12px_30px_rgba(42,34,29,0.06)] backdrop-blur transition-all duration-300'>
            <div className='inline-flex w-3/4 items-center justify-center rounded-full border border-[#cfc5b7] bg-[#fffdf9] px-6 py-3 sm:w-1/2'>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='flex-1 outline-none bg-inherit text-sm'
                    type="text"
                    placeholder='Search the collection'
                />
                <img className='w-4' src={assets.search_icon} alt="Search" />
            </div>
            <img
                onClick={() => setShowSearch(false)}
                className='ml-4 inline w-3 cursor-pointer'
                src={assets.cross_icon}
                alt="Close"
            />
        </div>
    ) : null
}

export default SearchBar
