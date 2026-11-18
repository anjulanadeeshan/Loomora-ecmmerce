import React, { useContext, useMemo, useState } from "react";
import ShopContext from "../context/ShopContext.js";
import { assets } from "../assets/frontend_assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products,search,showSearch} = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  const [sortType, setSortType] = useState('relevant');

  // Handle Category Filter
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((i) => i !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  // Handle SubCategory Filter
  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((i) => i !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const filteredProducts = useMemo(() => {
    let productsCopy = products.slice();

    if(showSearch && search) {
      productsCopy = productsCopy.filter((item)=> item.name.toLowerCase().includes(search.toLowerCase()))
    }
    // Category filter
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    // SubCategory filter
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    switch (sortType) {
      case 'low-high': 
        return productsCopy.sort((a, b) => a.price - b.price);

      case 'high-low': 
        return productsCopy.sort((a, b) => b.price - a.price);

      default:
        return productsCopy;
    }
  }, [products, showSearch, search, category, subCategory, sortType]);

  return (
    <main className="page-shell page-pad page-enter">
      <div className="mb-12 max-w-2xl">
        <p className="eyebrow mb-4">The complete edit</p>
        <h1 className="editorial-title">Find your next signature piece.</h1>
        <p className="mt-5 text-sm leading-7 text-[#746d65]">Explore elevated essentials, statement layers and modern silhouettes curated for every version of you.</p>
      </div>
      <div className="flex flex-col gap-8 sm:flex-row sm:gap-10">
      {/* LEFT FILTER SECTION */}
      <aside className="min-w-60 sm:w-60">
        {/* Filter dropdown */}
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="surface-card flex cursor-pointer items-center justify-between gap-2 px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] sm:border-0 sm:bg-transparent sm:px-0 sm:shadow-none"
        >
          Filter
          <img
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden transition-all ${
              showFilter ? "rotate-180" : ""
            }`}
            alt=""
          />
        </p>

        {/* Category Filter */}
        <div
          className={`surface-card mt-4 p-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-4 text-[10px] font-bold tracking-[0.18em] text-[#7d263d]">CATEGORIES</p>

          <div className="flex flex-col gap-3 text-sm text-[#5f5851]">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4"
                value="Men"
                onChange={toggleCategory}
              />
              Men
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4"
                value="Women"
                onChange={toggleCategory}
              />
              Women
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4"
                value="Kids"
                onChange={toggleCategory}
              />
              Kids
            </label>
          </div>
        </div>

        {/* SubCategory Filter */}
        <div
          className={`surface-card my-4 p-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-4 text-[10px] font-bold tracking-[0.18em] text-[#7d263d]">TYPE</p>

          <div className="flex flex-col gap-3 text-sm text-[#5f5851]">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4"
                value="Topwear"
                onChange={toggleSubCategory}
              />
              Topwear
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4"
                value="Bottomwear"
                onChange={toggleSubCategory}
              />
              Bottomwear
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4"
                value="Winterwear"
                onChange={toggleSubCategory}
              />
              Winterwear
            </label>
          </div>
        </div>
      </aside>

      {/* RIGHT PRODUCT GRID */}
      <div className="flex-1">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#ded7cc] pb-5 sm:flex-row sm:items-end">
          <div className="w-full sm:w-auto">
            <Title text1={`${filteredProducts.length} pieces`} text2="All collection" />
          </div>

          {/* Sort Dropdown (optional) */}
          <select className="rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-wider" value={sortType} onChange={(e)=>setSortType(e.target.value)}>
            <option value="relevant" >Sort by: Relevant</option>
            <option value="low-high" >Sort by: Low to High</option>
            <option value="high-low" >Sort by: High to Low</option>
          </select>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {filteredProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
        </div>
      </div>
    </main>
  );
};

export default Collection;
