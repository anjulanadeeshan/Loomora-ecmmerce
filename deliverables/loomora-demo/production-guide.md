# Loomora — 90-second LinkedIn demonstration kit

## Deliverable status

This is a production-ready recording plan, not a rendered video. No video, narration audio, or production-account recordings were created. The accompanying SRT is timed to the planned narration; align its cue boundaries to the recorded voice before final export.

Developer: Anjula Nadeeshan  
Website: https://loomora-web.netlify.app  
Repository: https://github.com/anjulanadeeshan/Loomora-ecmmerce.git

## Inspection and scope

The live homepage was inspected, and the local application routes and collection, checkout, dashboard, order-management, and feedback source were checked. Authenticated admin screens were not inspected in this run: a private demo login is required before recording them. Code presence is not evidence that production payment processing or email delivery succeeded.

The checkout UI lists Stripe, Razorpay, and cash on delivery. Present them as available UI choices, not verified completed payment integrations. Order-status controls save on change: do not select a new status while filming production records.

The homepage contains marketing figures such as “50K+” customers and sample testimonials. Exclude those sections from the recording; they are not evidence of business performance. Dashboard figures must be from demo records and labeled “Demo data”; do not relabel actual customer activity as demo data.

Confirm the live deployment includes the latest password-eye and admin-drawer changes before capture. If it does not, record the current local build consistently and label it “Local demo”; do not mix versions without explanation.

## Timeline and actionable shot list

All times below refer to the final edit, not raw recording time.

| Time | Actual footage and action | Overlay / edit |
|---|---|---|
| 00:00–00:06 | Homepage hero, steady wide view; gentle cursor move toward Shop the edit. | “Loomora” / “Full-Stack Fashion E-Commerce” / “A portfolio project by Anjula Nadeeshan”. |
| 00:06–00:12 | Open Collection. Enable search and enter a term that returns products, such as “shirt”. Hold the resulting grid. | “Product discovery”. Cut typing down to about one second. |
| 00:12–00:19 | Clear search, select an appropriate category, then sort price low to high. Hold actual resulting products. | “Search • Filter • Sort”; small “Cloudinary-hosted images”. |
| 00:19–00:25 | Open one real product. Show the price, description, and sizes; change image only if that product has multiple images. | “Product details”. Use a restrained 105% crop to make the controls readable. |
| 00:25–00:32 | Select an available size, add to cart, open bag, increase quantity once and hold the updated total. | “Shopping bag”. Use a demo account/session; no checkout submission. |
| 00:32–00:38 | Open checkout. Show blank or fictional delivery fields and the payment-method choices. | “Checkout overview”. Do not click Place Order or suggest a successful payment. |
| 00:38–00:43 | After private customer login, show an existing demo order and status. | “Order history”. If no demo order exists, show the genuine empty state; do not fabricate a record. |
| 00:43–00:47 | Login page: enter only a dummy demonstration password and toggle the eye once. | “Account access”. Never reveal an actual password, including a demo-account password. |
| 00:47–00:50 | Brief password-recovery screen, then newsletter interface. Do not submit either. | “Recovery & newsletter interfaces”. Mention Brevo integration, not verified inbox delivery. |
| 00:50–00:56 | Cut directly to the admin dashboard after private authentication. Show the four summary cards. | Burgundy transition label “Admin Management”; “Demo data” if the records are genuinely demo records. |
| 00:56–00:62 | Small controlled scroll to Recent Orders and Management Suite. | “Operational overview”. Mask identifying fields before export. |
| 00:62–00:65 | Product management listing; move cursor toward an edit control without saving anything. | “Catalogue management”. |
| 00:65–00:69 | Orders listing: enter a demo search, clear it, select a top-of-page status filter. | “Order search & filters”. These are filters, not row update controls. |
| 00:69–00:72 | Show a row's status selector; open it and dismiss with Escape, without choosing a new value. | “Fulfillment controls”. If opening risks accidental change, use a steady shot of the closed selector. |
| 00:72–00:74 | Customer directory using fictional demo records or fully masked personal columns. | “Customer management”. |
| 00:74–00:76 | Feedback management listing. No approve, reject, or remove actions. | “Feedback management”. |
| 00:76–00:80 | Portrait-width admin view inset into the landscape canvas; open the mobile drawer, then close it. | “Responsive administration”. Record at 390×844; fit within the 1080p canvas without stretching. |
| 00:80–00:83 | Keep a mobile/storefront image beside a simple two-line deployment graphic. | “React + Tailwind → Netlify” / “Node.js + Express → Docker / VPS / Nginx / HTTPS”. Footer: “MongoDB Atlas • Cloudinary • Brevo”. |
| 00:83–00:90 | Cut back to homepage hero with a translucent cream closing panel. | “Designed & Developed by Anjula Nadeeshan” / “React • Node.js • Express • MongoDB” / “Explore the project — links in the post”. Fade to logo in the final second. |

## Exact voiceover — 180 words

Read with a calm, conversational delivery. Each segment has a fixed slot; leave brief pauses instead of stretching words. Recording each segment separately makes timing easier.

**00:00–00:06**

Meet Loomora, my full-stack fashion e-commerce project, connecting a modern storefront with practical admin tools.

**00:06–00:12**

Customers can browse the collection and narrow their choices using search, categories, and price sorting.

**00:12–00:19**

Cloudinary-hosted images bring the catalogue to life, with a consistent visual experience across the store.

**00:19–00:25**

Product pages present images, descriptions, prices, and available sizes.

**00:25–00:32**

Select a size, add an item, and adjust quantities in the shopping bag.

**00:32–00:38**

Checkout brings delivery information, order totals, and payment choices together.

**00:38–00:43**

Customers can also review their previous orders and current status.

**00:43–00:50**

Account screens include password visibility and recovery, alongside a newsletter interface integrated with Brevo.

**00:50–00:56**

Behind the storefront, the admin dashboard summarizes revenue, orders, products, and registered customers.

**00:56–01:02**

Recent orders and management shortcuts keep essential information easy to reach.

**01:02–01:09**

Administrators can review the catalogue, search orders, and filter by fulfillment or payment status.

**01:09–01:16**

Order controls, customer records, and feedback management complete the administrative workspace.

**01:16–01:23**

The responsive interface pairs a Netlify frontend with a Docker-based backend running on a VPS.

**01:23–01:30**

I'm Anjula Nadeeshan. Explore Loomora through the links in this post. I'd love your feedback.

## Recording procedure

1. Use a clean browser profile, hide bookmarks and notifications, and capture only the application viewport. Record desktop clips at 1920×1080, 30 fps.
2. Prepare separate customer and admin demo sessions. The account owner must log in privately with recording paused; never request credentials in chat or capture the login process.
3. Use existing fictional records. If none exist, record honest empty states or obtain permission to create isolated demo data. Do not seed, delete, or modify production records for this video.
4. Rehearse each shot, let images finish loading, and record 2–3 seconds of stillness before and after the action. Record clips separately in timeline order.
5. Use the same product throughout discovery, product details, and cart. Record checkout without pressing Place Order. Do not trigger emails.
6. For authenticated screens, use prepared demo records. Crop or track opaque masks over any real names, emails, addresses, avatars, order IDs, and contact details. Inspect every frame during transitions.
7. Record the mobile drawer at portrait viewport dimensions, then place that recording within a cream landscape background. Keep the desktop canvas 1920×1080.
8. Record the 14 narration segments using the exact script. Use any editor you already have that supports screen footage, audio, overlays, and subtitle import. No paid assets are required.

## Editing specification

- Timeline: exactly 00:01:30:00 at 30 fps (2,700 frames). Do not add an intro outside this duration.
- Palette: cream #FFFDF9, burgundy #7D263D, charcoal #1D1A17; muted gold #B4935F only as a small accent.
- Typography: elegant serif title, simple sans-serif labels and subtitles. Use the actual Loomora logo from the app.
- Cuts: mostly straight cuts. Use a short dissolve only for the admin transition and closing; include transitions within the allocated shot durations.
- Motion: at most 100–108% zoom, no cursor trails or exaggerated animation. Zoom must not cut off controls or captions.
- Safe margins: keep titles and important UI at least 96 px from the left/right and 70 px from the top/bottom. Place captions on a dark translucent band, away from buttons.
- Captions: import loomora-demo.srt, wrap to at most two lines at phrase boundaries, approximately 42 characters per line. Use a readable 40–44 px sans-serif at 1080p. Re-time to actual narration; these timestamps are a prepared schedule, not audio-verified synchronization.
- Audio: clear centered narration; instrumental music with explicit permission for LinkedIn/social use. Retain the license/source. Duck music roughly 18–24 dB below narration; omit music if licensing is unclear.
- Export: MP4, H.264, 1920×1080, 30 fps, approximately 10–16 Mbps; AAC audio at 48 kHz. Aim for around -14 to -16 LUFS integrated and true peak below -1 dBTP.
- Final review: confirm duration ≤90 seconds, subtitles match speech, UI labels are readable on a phone, personal details are hidden, and nothing implies successful payment or delivery without evidence.
- Review the final MP4 before uploading. No publishing is authorized by this production plan.

## LinkedIn caption

Introducing Loomora — my full-stack fashion e-commerce portfolio project.

This walkthrough brings together the customer shopping journey and the admin workspace: product discovery, size selection, cart and checkout interfaces, order history, catalogue management, order filtering, customer records, and feedback.

Built with React, Tailwind CSS, Node.js, Express, and MongoDB Atlas, with Cloudinary for product images and Brevo for email integration. The frontend runs on Netlify, while the backend runs in Docker on a VPS behind Nginx and HTTPS.

Developing Loomora has helped me connect frontend design, API development, data management, and deployment in one practical project.

I'd love your feedback on the experience and implementation.

Live demo: https://loomora-web.netlify.app
Code: https://github.com/anjulanadeeshan/Loomora-ecmmerce.git

#FullStackDevelopment #ReactJS #NodeJS #MongoDB #WebDevelopment #PortfolioProject

## Thumbnail concept

Title: “Loomora | Full-Stack E-Commerce”

1920×1080 landscape. Cream background, burgundy accent rule, actual Loomora logo upper left. Main title on the left with “Customer experience + Admin management” below. On the right, overlap two actual screenshots: the homepage hero as the larger frame and the admin dashboard as a smaller inset. Use a prepared demo dashboard or mask personal details. Bottom-left credit: “Anjula Nadeeshan”. Keep text sparse and large; avoid badges implying real sales or business success.

This is a thumbnail brief, not an image already generated.

