import React, { useContext, useEffect, useState } from "react";
import ShopContext from "../context/ShopContext.js";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products, currency } = useContext(ShopContext);

  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 10));
    }
  }, [products]);

  return (
    <section className="section-space">
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <Title text1="Freshly curated" text2="Latest collection" />
        <p className="max-w-md text-sm leading-7 text-[#746d65] md:text-right">
          New-season pieces selected for effortless styling and everyday confidence.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-6">
        {latestProducts.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            currency={currency}
          />
        ))}
      </div>
    </section>
  );
};

export default LatestCollection;
