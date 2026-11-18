# Pending Cloudinary product upload

The 16 images listed in `pendingCloudinaryProducts.json` are preparation files only. They are not imported by the frontend or backend.

## Before upload

1. Review each product name, description, category and subcategory.
2. Review the prepared prices, which are currently distributed between `$20` and `$30`.
3. Confirm each product's available sizes and remove unavailable sizes.
4. Keep `bestseller` as `false` unless the product should be featured.

## Upload

1. In Cloudinary, open the `loomora/products` asset folder.
2. Upload each renamed `sourceFile` from the local `frontend/src/assets/frontend_assets/products` folder.
3. Use the matching `cloudinaryPublicId` from the manifest when Cloudinary allows a public ID to be set.
4. Copy the resulting secure URL into the matching `product.image` array.
5. Put the primary/front URL first when a product later has multiple images.

Prefer an optimized delivery URL containing `/upload/f_auto,q_auto/`.

## After upload

1. Replace each `null` `date` with `Date.now()` or the desired millisecond timestamp.
2. Validate that every URL opens without authentication.
3. Add the product records to MongoDB. MongoDB will generate `_id`, `createdAt`, `updatedAt` and `__v`.
4. Only after the Cloudinary URLs are complete, generate optional frontend fallback entries for `assets.js`. Use `frontendId` as the fallback `_id`.

Do not import the local source images into `assets.js` and do not add them to `productImages.js`.
