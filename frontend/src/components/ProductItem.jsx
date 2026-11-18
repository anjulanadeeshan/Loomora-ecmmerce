import React, { useContext } from "react";
import ShopContext from "../context/ShopContext.js";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  const displayImage = Array.isArray(image) ? image[0] : image;

  return (
    <Link className="group block text-[#1d1a17]" to={`/product/${id}`}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-[#ede8df]">
        <img
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          src={displayImage}
          alt={name}
        />
        <span className="absolute bottom-3 right-3 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-white/90 text-lg opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">↗</span>
      </div>

      <div className="flex items-start justify-between gap-3 pt-4">
        <p className="text-sm font-medium leading-5 transition-colors group-hover:text-[#7d263d]">{name}</p>
        <p className="whitespace-nowrap text-sm font-semibold">{currency}{price}</p>
      </div>
      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#8c847b]">Loomora edit</p>
    </Link>
  );
};

export default ProductItem;
