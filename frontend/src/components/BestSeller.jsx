import React, { useContext, useEffect, useState } from "react";
import ShopContext from "../context/ShopContext.js";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);
  return (
    <section className="section-space border-y border-[#ded7cc]">
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <Title text1="Loved by you" text2="The bestsellers" />
        <p className="max-w-md text-sm leading-7 text-[#746d65] md:text-right">
          The most-wanted pieces in the Loomora wardrobe, chosen again and again.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-6">
        {bestSeller.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}

          />
        ))}
      </div>
    </section>
  );
};

export default BestSeller;
