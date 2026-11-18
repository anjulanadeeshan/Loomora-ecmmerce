import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShopContext from "../context/ShopContext.js";
import { assets } from "../assets/frontend_assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products,currency,addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = useCallback(() => {
    const product = products.find((item) => item._id === productId);

    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [productId, products]);

  useEffect(() => {
    fetchProductData();
    window.scrollTo(0, 0);
  }, [fetchProductData]);

  return productData ? (
    <main className="page-shell page-pad page-enter">
      {/*----------- Product Data -----------------*/}
      <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        {/*---------- Product Images (Left Side) ----------*/}
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          {/* Thumbnails List */}
          <div className="flex w-full gap-3 overflow-x-auto sm:w-24 sm:flex-col sm:overflow-y-auto">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className={`aspect-[3/4] w-[24%] shrink-0 cursor-pointer rounded-xl border object-cover transition sm:w-full ${image === item ? 'border-[#7d263d] ring-2 ring-[#7d263d]/10' : 'border-[#ded7cc] hover:border-[#b4935f]'}`}
                alt="Thumbnail"
              />
            ))}
          </div>
          {/* Main Image */}
          <div className="w-full overflow-hidden rounded-[2rem] bg-[#ede8df] sm:flex-1">
            <img className="aspect-[3/4] h-full w-full object-cover" src={image} alt={productData.name} />
          </div>
        </div>

        {/*---------- Product Info (Right Side) ----------*/}
        <div className="self-center lg:sticky lg:top-28">
          <p className="eyebrow">Loomora selection</p>
          <h1 className="display-font mt-4 text-4xl leading-tight sm:text-5xl">{productData.name}</h1>

          {/* Star Ratings (Static for now) */}
          <div className="mt-4 flex items-center gap-1">
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2 text-xs text-[#746d65]">122 reviews</p>
          </div>

          <p className="mt-7 text-2xl font-semibold">{currency}{productData.price}</p>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#746d65]">
            {productData.description}
          </p>

          {/* Size Selector */}
          <div className="my-8 flex flex-col gap-4 border-y border-[#ded7cc] py-7">
            <p className="text-xs font-bold uppercase tracking-[0.14em]">Select size</p>
            <div className="flex flex-wrap gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`grid h-11 min-w-12 place-items-center rounded-full border px-4 text-sm transition ${
                    item === size ? "border-[#7d263d] bg-[#7d263d] text-white" : "border-[#ded7cc] bg-[#fffdf9] hover:border-[#7d263d]"
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button onClick={()=>addToCart(productData._id, size)} className="fashion-button w-full sm:w-auto">
            ADD TO CART
          </button>

          {/* Additional Product Policies */}
          <div className="mt-7 flex flex-col gap-2 text-xs text-[#746d65]">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* ---------- Description & Reviews Section (Bottom) ---------- */}
      <div className="mt-20 overflow-hidden rounded-[1.5rem] border border-[#ded7cc] bg-[#fffdf9]">
        <div className="flex border-b border-[#ded7cc]">
          <b className="border-r border-[#ded7cc] px-6 py-4 text-xs uppercase tracking-wider text-[#7d263d]">Description</b>
          <p className="px-6 py-4 text-xs uppercase tracking-wider text-[#746d65]">Reviews (122)</p>
        </div>
        <div className="flex max-w-4xl flex-col gap-4 px-6 py-7 text-sm leading-7 text-[#746d65]">
          <p>
            Each piece in our collection is carefully selected to meet the highest standards of quality and style. We work directly with manufacturers to ensure authentic materials, superior craftsmanship, and ethical production practices.
          </p>
          <p>
            Our products feature detailed sizing guides, high-resolution imagery, and comprehensive care instructions. We believe in transparency – what you see is exactly what you'll receive, backed by our satisfaction guarantee.
          </p>
        </div>
      </div>
      {/* display related products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </main>
  ) : (
    <div className="opacity-0"></div>
  ); 
};

export default Product;
