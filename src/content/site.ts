import { images } from "@/components/xeno/data";

export type Product = {
  slug: string;
  name: string;
  short: string;
  hero: string;
  intro: string;
  gallery: string[];
  features: { title: string; copy: string }[];
  materials: { name: string; detail: string }[];
  customization: string[];
  pricing: { tier: string; qty: string; price: string; note: string }[];
  faq: { q: string; a: string }[];
  related: string[];
};

const g = (a: string, b: string, c: string) => [a, b, c];

export const products: Product[] = [
  {
    slug: "custom-t-shirts",
    name: "Custom T-Shirts",
    short: "Heavyweight combed cotton tees, oversized or regular, printed in-house.",
    hero: images.tshirt,
    intro:
      "Our tee program starts at 180 GSM bio-washed cotton and goes up to 260 GSM heavyweight loop-knit. Every garment is cut, printed, cured and inspected inside our own facility, so colour and hand-feel stay identical from the first piece to the five-thousandth.",
    gallery: g(images.tshirt, images.jersey, images.welcomekit),
    features: [
      { title: "Colour-locked printing", copy: "Pantone-matched inks with spectrophotometer verification on every run." },
      { title: "Zero-crack cure", copy: "Conveyor-cured at 165°C so prints survive 40+ industrial washes." },
      { title: "Fit engineering", copy: "Regular, oversized drop-shoulder and boxy fits graded from XS to 5XL." },
      { title: "Private labelling", copy: "Woven neck labels, custom hangtags and poly-bag branding included at scale." },
    ],
    materials: [
      { name: "Combed Cotton 180 GSM", detail: "Soft, breathable, everyday corporate tees." },
      { name: "Heavyweight Cotton 240 GSM", detail: "Structured drape for oversized streetwear fits." },
      { name: "Cotton–Lycra Bio-wash", detail: "Shrink-controlled with four-way stretch." },
      { name: "French Terry 260 GSM", detail: "Premium loopback for elevated merch drops." },
    ],
    customization: ["DTF full-colour print", "Screen printing", "Puff & high-density print", "Embroidery", "Woven labels", "Custom neck tape", "Individual poly packing"],
    pricing: [
      { tier: "Starter", qty: "25 – 99 pcs", price: "₹399", note: "Single-location print" },
      { tier: "Growth", qty: "100 – 499 pcs", price: "₹329", note: "Two-location print + labels" },
      { tier: "Enterprise", qty: "500+ pcs", price: "₹279", note: "Full private label programme" },
    ],
    faq: [
      { q: "What is the minimum order quantity?", a: "25 pieces per design for printed tees, 50 for embroidered or private-labelled programmes." },
      { q: "How long does production take?", a: "7–10 working days after mockup approval. Rush production in 96 hours is available." },
      { q: "Can I mix sizes and colours?", a: "Yes — MOQ applies per design, not per size or colour." },
    ],
    related: ["oversized-t-shirts", "hoodies", "corporate-uniforms"],
  },
  {
    slug: "sports-jerseys",
    name: "Sports Jerseys",
    short: "Full sublimation performance kits for clubs, tournaments and corporate leagues.",
    hero: images.jersey,
    intro:
      "Sublimated edge-to-edge on micro-poly dry-fit knit, our jerseys carry player names, numbers, sponsor blocks and league badges without a single layer of surface ink — nothing to peel, crack or fade.",
    gallery: g(images.jersey, images.tshirt, images.cap),
    features: [
      { title: "Edge-to-edge sublimation", copy: "Unlimited colours and gradients at no extra cost per colour." },
      { title: "Moisture management", copy: "Micro-mesh panels at underarm and back yoke for airflow." },
      { title: "Roster automation", copy: "Send a spreadsheet — we set names and numbers and packi by player." },
      { title: "Match-ready QC", copy: "Every kit checked against the roster sheet before packing." },
    ],
    materials: [
      { name: "Micro Poly Dry Fit 140 GSM", detail: "Lightweight competition weight." },
      { name: "Interlock Poly 160 GSM", detail: "Opaque, structured, premium hand." },
      { name: "Poly-Spandex Mesh", detail: "High-stretch panels for basketball and cycling." },
    ],
    customization: ["Full sublimation", "Player name & number", "Sponsor placements", "Contrast collars & cuffs", "Matching shorts", "Team packing bags"],
    pricing: [
      { tier: "Club", qty: "15 – 49 sets", price: "₹649", note: "Jersey only" },
      { tier: "League", qty: "50 – 199 sets", price: "₹549", note: "Jersey + shorts" },
      { tier: "Federation", qty: "200+ sets", price: "₹469", note: "Full kit with bags" },
    ],
    faq: [
      { q: "Do you provide design support?", a: "Yes — two kit concepts and unlimited revisions are included with every order." },
      { q: "Is there an extra charge for names and numbers?", a: "No. Sublimated personalisation is included in the per-set price." },
      { q: "Can you match our exact brand colours?", a: "We print to Pantone references and send a physical strike-off on request." },
    ],
    related: ["custom-t-shirts", "custom-caps", "event-merchandise"],
  },
  {
    slug: "oversized-t-shirts",
    name: "Oversized T-Shirts",
    short: "Drop-shoulder heavyweight silhouettes built for streetwear-grade merch drops.",
    hero: images.tshirt,
    intro:
      "Cut on a dedicated oversized block — wider chest, dropped armhole, longer body — in 240 GSM loop-knit cotton that holds its shape instead of collapsing after the first wash.",
    gallery: g(images.tshirt, images.welcomekit, images.stickers),
    features: [
      { title: "True drop shoulder", copy: "Graded pattern, not an upsized regular tee." },
      { title: "Puff & high-density", copy: "Raised prints with a tactile, retail-grade finish." },
      { title: "Garment dye options", copy: "Pigment-dyed washes for a lived-in premium look." },
      { title: "Retail packing", copy: "Folded, banded and barcoded for direct shelf placement." },
    ],
    materials: [
      { name: "Loop Knit Cotton 240 GSM", detail: "The core oversized fabric." },
      { name: "Terry Cotton 260 GSM", detail: "Heavier, structured drape." },
      { name: "Acid-wash Cotton", detail: "Character finish for limited drops." },
    ],
    customization: ["Puff print", "High-density print", "Embroidered chest hits", "Back panel prints", "Sleeve prints", "Custom woven labels"],
    pricing: [
      { tier: "Drop", qty: "25 – 99 pcs", price: "₹649", note: "Front print" },
      { tier: "Capsule", qty: "100 – 499 pcs", price: "₹549", note: "Front + back" },
      { tier: "Retail", qty: "500+ pcs", price: "₹489", note: "Full private label" },
    ],
    faq: [
      { q: "How much oversized is the fit?", a: "Roughly two sizes wider in the chest with a 4 cm dropped shoulder versus our regular block." },
      { q: "Will puff print survive washing?", a: "Yes — cured puff holds through 30+ home washes when washed inside out." },
      { q: "Can I get a sample first?", a: "Paid samples ship in 5 working days and the cost is adjusted against bulk." },
    ],
    related: ["custom-t-shirts", "hoodies", "college-merchandise"],
  },
  {
    slug: "hoodies",
    name: "Hoodies & Sweatshirts",
    short: "Brushed fleece and French terry hoodies with retail-grade construction.",
    hero: images.welcomekit,
    intro:
      "Double-layer hoods, metal-tipped drawcords, kangaroo pockets and reinforced side gussets — the details that separate merchandise people keep from merchandise people bin.",
    gallery: g(images.welcomekit, images.tshirt, images.uniform),
    features: [
      { title: "320–400 GSM fleece", copy: "Winter-weight warmth without stiffness." },
      { title: "Reinforced construction", copy: "Bar-tacked pockets and twin-needle hems." },
      { title: "Embroidery ready", copy: "Chest, sleeve and hood embroidery with 3D options." },
      { title: "Zip or pullover", copy: "Full-zip, half-zip and classic pullover blocks." },
    ],
    materials: [
      { name: "Cotton Fleece 340 GSM", detail: "Brushed inside, soft and warm." },
      { name: "French Terry 320 GSM", detail: "Loopback, all-season weight." },
      { name: "Poly-Cotton Blend 400 GSM", detail: "Heavy, structured, shrink-resistant." },
    ],
    customization: ["3D embroidery", "Applique patches", "Screen print", "Contrast hood lining", "Custom zip pullers", "Personalised names"],
    pricing: [
      { tier: "Starter", qty: "25 – 99 pcs", price: "₹1,149", note: "Single embroidery" },
      { tier: "Growth", qty: "100 – 299 pcs", price: "₹949", note: "Two placements" },
      { tier: "Enterprise", qty: "300+ pcs", price: "₹849", note: "Full customisation" },
    ],
    faq: [
      { q: "Do hoodies come in unisex sizing?", a: "Yes, XS–5XL unisex, with a women's cut available above 100 pieces." },
      { q: "Can you match a specific melange grey?", a: "We stock four melange tones and can dye-to-order above 300 pieces." },
      { q: "What is the lead time?", a: "12–14 working days for embroidered hoodie programmes." },
    ],
    related: ["oversized-t-shirts", "college-merchandise", "corporate-uniforms"],
  },
  {
    slug: "corporate-uniforms",
    name: "Corporate Uniforms",
    short: "Polos, formal shirts and workwear with embroidered brand identity.",
    hero: images.uniform,
    intro:
      "Uniform programmes designed for rotation: identical fabric lots, size-wise packing per branch, and a re-order portal so year two looks exactly like year one.",
    gallery: g(images.uniform, images.tshirt, images.cap),
    features: [
      { title: "Lot consistency", copy: "Reserved fabric lots so reorders match the original shade." },
      { title: "Branch-wise packing", copy: "Cartons labelled by location, department and size." },
      { title: "Wash-tested", copy: "Industrial laundry tested to 50 cycles for hospitality use." },
      { title: "Role coding", copy: "Colour and trim coding by department or seniority." },
    ],
    materials: [
      { name: "Pique Cotton 220 GSM", detail: "Classic polo fabric with structure." },
      { name: "Poly-Cotton Twill", detail: "Durable workwear shirting." },
      { name: "Performance Knit", detail: "Stretch fabric for field and service teams." },
    ],
    customization: ["Chest embroidery", "Name badges", "Contrast plackets", "Department colour coding", "Reflective tape", "Custom buttons"],
    pricing: [
      { tier: "Team", qty: "50 – 199 pcs", price: "₹699", note: "Polo + logo" },
      { tier: "Branch", qty: "200 – 999 pcs", price: "₹619", note: "Multi-role sets" },
      { tier: "National", qty: "1000+ pcs", price: "₹549", note: "Annual contract" },
    ],
    faq: [
      { q: "Can you hold stock for us?", a: "Yes — annual contracts include buffer stock with monthly release." },
      { q: "Do you handle measurement drives?", a: "Our team runs on-site sizing camps for orders above 500 pieces." },
      { q: "Are there GST invoices and purchase orders?", a: "Always. We work with standard corporate procurement processes." },
    ],
    related: ["custom-t-shirts", "hoodies", "welcome-kits"],
  },
  {
    slug: "college-merchandise",
    name: "College Merchandise",
    short: "Department tees, fest hoodies, batch jackets and campus store programmes.",
    hero: images.tshirt,
    intro:
      "From a 40-piece department batch tee to a 4,000-piece convocation programme, we handle collection, size forms, name personalisation and hostel-wise delivery.",
    gallery: g(images.tshirt, images.welcomekit, images.stickers),
    features: [
      { title: "Name personalisation", copy: "Individual names and roll numbers at no extra setup." },
      { title: "Size-form portal", copy: "A shareable link collects sizes and names automatically." },
      { title: "Batch pricing", copy: "Transparent per-head pricing you can circulate to the group." },
      { title: "Campus delivery", copy: "Sorted by department, section or hostel block." },
    ],
    materials: [
      { name: "Bio-wash Cotton 180 GSM", detail: "Budget-friendly batch tees." },
      { name: "Heavyweight Cotton 240 GSM", detail: "Premium fest and convocation merch." },
      { name: "Fleece 340 GSM", detail: "Batch hoodies and varsity jackets." },
    ],
    customization: ["Individual names", "Batch year graphics", "Department crests", "Sleeve prints", "Signature back panels", "Varsity patches"],
    pricing: [
      { tier: "Batch", qty: "40 – 149 pcs", price: "₹349", note: "Tee with names" },
      { tier: "Fest", qty: "150 – 499 pcs", price: "₹299", note: "Multi-design run" },
      { tier: "Campus", qty: "500+ pcs", price: "₹259", note: "Full campus programme" },
    ],
    faq: [
      { q: "Can each student pay individually?", a: "Yes — we can issue a collection link so the organiser is not out of pocket." },
      { q: "How fast can fest merch be delivered?", a: "As quick as 6 working days for standard tees with a confirmed size list." },
      { q: "Do you design the artwork?", a: "Included. Share a theme and our studio delivers three concepts." },
    ],
    related: ["oversized-t-shirts", "hoodies", "event-merchandise"],
  },
  {
    slug: "event-merchandise",
    name: "Event Merchandise",
    short: "Conference, festival and activation kits delivered against hard deadlines.",
    hero: images.stickers,
    intro:
      "Events do not move. Neither do our event timelines — locked production slots, staged deliveries and on-site drop coordination for conferences, launches and roadshows.",
    gallery: g(images.stickers, images.cap, images.welcomekit),
    features: [
      { title: "Deadline lock", copy: "A reserved production slot with penalty-backed delivery dates." },
      { title: "Multi-item kits", copy: "Tees, lanyards, stickers, bottles and totes in one kit." },
      { title: "Staged shipping", copy: "Split deliveries to venue, office and speaker addresses." },
      { title: "On-site support", copy: "Optional distribution crew for large activations." },
    ],
    materials: [
      { name: "Cotton Tees", detail: "Crew and attendee apparel." },
      { name: "Vinyl & Paper", detail: "Stickers, badges and signage." },
      { name: "Canvas & Jute", detail: "Delegate bags and totes." },
    ],
    customization: ["Sponsor logo grids", "Crew vs attendee variants", "Numbered editions", "Kit inserts", "QR-coded packaging"],
    pricing: [
      { tier: "Activation", qty: "100 – 299 kits", price: "₹749", note: "3-item kit" },
      { tier: "Conference", qty: "300 – 999 kits", price: "₹649", note: "5-item kit" },
      { tier: "Festival", qty: "1000+ kits", price: "₹569", note: "Custom kit build" },
    ],
    faq: [
      { q: "What is your fastest turnaround?", a: "72 hours for sticker and badge-led kits, 6 days for apparel-led kits." },
      { q: "Can you ship directly to a venue?", a: "Yes, with timed delivery slots and an on-site handover contact." },
      { q: "Do you store leftover stock?", a: "We warehouse surplus for up to 90 days free of charge." },
    ],
    related: ["laptop-stickers", "custom-caps", "promotional-merchandise"],
  },
  {
    slug: "laptop-stickers",
    name: "Laptop Stickers",
    short: "Die-cut vinyl stickers with true-tone print and residue-free adhesive.",
    hero: images.stickers,
    intro:
      "Printed on 90-micron calendered vinyl with a matte or gloss laminate, contour cut on a registered die and finished with a clean kiss-cut backing that peels first try.",
    gallery: g(images.stickers, images.tshirt, images.cap),
    features: [
      { title: "Contour die-cut", copy: "Cut to your artwork outline, not a rectangle." },
      { title: "Residue-free", copy: "Peels clean off laptops and bottles for up to three years." },
      { title: "Scratch laminate", copy: "Matte or gloss laminate resists keys, bags and coffee." },
      { title: "True-tone print", copy: "Eight-colour print with white and spot options." },
    ],
    materials: [
      { name: "Calendered Vinyl 90µ", detail: "Standard laptop and journal stickers." },
      { name: "Cast Vinyl 60µ", detail: "Conformable for curved surfaces." },
      { name: "Holographic Vinyl", detail: "Prismatic finish for limited packs." },
    ],
    customization: ["Custom die shapes", "Matte / gloss / holographic", "Kiss-cut sheets", "Sticker packs with backing card", "Numbered editions"],
    pricing: [
      { tier: "Pack", qty: "250 – 999 pcs", price: "₹14", note: "Per sticker" },
      { tier: "Series", qty: "1,000 – 4,999 pcs", price: "₹9", note: "Per sticker" },
      { tier: "Bulk", qty: "5,000+ pcs", price: "₹6", note: "Per sticker" },
    ],
    faq: [
      { q: "Are they waterproof?", a: "Fully. Vinyl and laminate are both waterproof and UV stable." },
      { q: "What file do you need?", a: "Vector AI, EPS or SVG. We can vectorise raster art for a small fee." },
      { q: "Minimum quantity per design?", a: "250 pieces per design, mixable across a pack." },
    ],
    related: ["vinyl-stickers", "waterproof-stickers", "event-merchandise"],
  },
  {
    slug: "vinyl-stickers",
    name: "Vinyl Stickers",
    short: "Indoor and outdoor vinyl decals for glass, vehicles, walls and equipment.",
    hero: images.stickers,
    intro:
      "Large-format vinyl printed and plotted for signage, storefronts, fleet branding and factory floor marking — with the right adhesive class for each surface.",
    gallery: g(images.stickers, images.uniform, images.welcomekit),
    features: [
      { title: "Surface-matched adhesive", copy: "Permanent, removable or high-tack, chosen per application." },
      { title: "Outdoor rated", copy: "Five-year UV rating on cast vinyl with laminate." },
      { title: "Cut vinyl lettering", copy: "Weeded and taped, ready to apply in one pass." },
      { title: "Installation kits", copy: "Squeegee, alignment tape and a fitting guide in every roll." },
    ],
    materials: [
      { name: "Monomeric Vinyl", detail: "Flat indoor surfaces." },
      { name: "Polymeric Vinyl", detail: "Mid-term outdoor signage." },
      { name: "Cast Vinyl", detail: "Vehicle wraps and compound curves." },
    ],
    customization: ["Contour cut", "Frosted glass finish", "One-way vision perforated", "Floor-grade anti-slip laminate", "Reverse-print for glass"],
    pricing: [
      { tier: "Sheet", qty: "Up to 10 sq ft", price: "₹95", note: "Per sq ft" },
      { tier: "Project", qty: "10 – 100 sq ft", price: "₹75", note: "Per sq ft" },
      { tier: "Rollout", qty: "100+ sq ft", price: "₹58", note: "Per sq ft" },
    ],
    faq: [
      { q: "Do you install?", a: "We install across Hyderabad and coordinate partner installers nationwide." },
      { q: "Can it be removed later?", a: "Yes, with removable adhesive selected at order time." },
      { q: "What resolution should artwork be?", a: "Vector preferred; raster at 150 dpi at final size." },
    ],
    related: ["laptop-stickers", "waterproof-stickers", "promotional-merchandise"],
  },
  {
    slug: "waterproof-stickers",
    name: "Waterproof Stickers",
    short: "Bottle, packaging and outdoor labels engineered for moisture and abrasion.",
    hero: images.stickers,
    intro:
      "Built for condensation, dishwashers, cold chain and rain — synthetic face stock, waterproof adhesive and a laminate that keeps the ink where you printed it.",
    gallery: g(images.stickers, images.welcomekit, images.jersey),
    features: [
      { title: "Cold-chain safe", copy: "Adhesive rated from −20°C to 80°C." },
      { title: "Dishwasher tested", copy: "Survives 50+ dishwasher cycles on bottles and tumblers." },
      { title: "Abrasion laminate", copy: "Anti-scuff finish for transit and handling." },
      { title: "Roll or sheet", copy: "Applicator-ready rolls for high-volume labelling." },
    ],
    materials: [
      { name: "Synthetic BOPP", detail: "Standard waterproof label stock." },
      { name: "Clear Polyester", detail: "No-label look on glass and PET." },
      { name: "Metallised Film", detail: "Silver and gold premium labels." },
    ],
    customization: ["Roll finishing", "Variable data & batch codes", "Spot UV", "Foil stamping", "Custom die shapes"],
    pricing: [
      { tier: "Launch", qty: "500 – 1,999 pcs", price: "₹11", note: "Per label" },
      { tier: "Scale", qty: "2,000 – 9,999 pcs", price: "₹7", note: "Per label" },
      { tier: "Production", qty: "10,000+ pcs", price: "₹4", note: "Per label" },
    ],
    faq: [
      { q: "Are these food-safe?", a: "Yes, with food-contact-compliant adhesive on request." },
      { q: "Can you print batch numbers?", a: "Variable data printing is supported on roll orders." },
      { q: "Do you supply on rolls?", a: "Yes, with your specified core size and unwind direction." },
    ],
    related: ["laptop-stickers", "vinyl-stickers", "packaging"],
  },
  {
    slug: "custom-caps",
    name: "Custom Caps",
    short: "Structured, dad and trucker caps with 3D embroidery and woven detail.",
    hero: images.cap,
    intro:
      "Six-panel structured, five-panel camp, unstructured dad caps and mesh truckers — with 3D puff embroidery, flat embroidery, leather patches or rubberised badges.",
    gallery: g(images.cap, images.jersey, images.uniform),
    features: [
      { title: "3D puff embroidery", copy: "Raised, retail-grade front hits." },
      { title: "Leather & PVC patches", copy: "Debossed leather or moulded rubber badges." },
      { title: "Custom closures", copy: "Metal buckle, snapback or fitted elastic." },
      { title: "Under-visor prints", copy: "Hidden branding under the brim." },
    ],
    materials: [
      { name: "Cotton Twill", detail: "Classic structured cap fabric." },
      { name: "Brushed Cotton", detail: "Soft unstructured dad caps." },
      { name: "Poly Mesh", detail: "Trucker back panels." },
    ],
    customization: ["3D embroidery", "Flat embroidery", "Leather patch", "Rubber badge", "Custom eyelets", "Woven inner tape"],
    pricing: [
      { tier: "Team", qty: "50 – 199 pcs", price: "₹399", note: "Front embroidery" },
      { tier: "Brand", qty: "200 – 999 pcs", price: "₹339", note: "Front + side" },
      { tier: "Retail", qty: "1000+ pcs", price: "₹289", note: "Full custom build" },
    ],
    faq: [
      { q: "Can you make a fully custom cap?", a: "Yes — custom panels, colours and trims above 500 pieces." },
      { q: "How many embroidery colours are included?", a: "Up to nine thread colours at no extra cost." },
      { q: "Lead time?", a: "10–12 working days; custom-build caps take 25 days." },
    ],
    related: ["sports-jerseys", "corporate-uniforms", "promotional-merchandise"],
  },
  {
    slug: "welcome-kits",
    name: "Welcome Kits",
    short: "Onboarding boxes that make day one feel like a brand experience.",
    hero: images.welcomekit,
    intro:
      "A rigid magnetic box, foam-cut insert, a tee that actually fits, a bottle people keep, and a printed note — assembled, quality-checked and shipped to home addresses.",
    gallery: g(images.welcomekit, images.tshirt, images.stickers),
    features: [
      { title: "Curated contents", copy: "We source, brand and assemble every item in the box." },
      { title: "Custom foam inserts", copy: "CNC-cut inserts so nothing shifts in transit." },
      { title: "Direct-to-home", copy: "Individual shipping to remote employees, size-matched." },
      { title: "Kit dashboard", copy: "A tracking sheet for HR with delivery status per employee." },
    ],
    materials: [
      { name: "Rigid Board 1200 GSM", detail: "Premium magnetic closure boxes." },
      { name: "Kraft Corrugated", detail: "Sustainable mailer kits." },
      { name: "EVA Foam Insert", detail: "Precision-cut product cradles." },
    ],
    customization: ["Box printing & foiling", "Foam insert design", "Item curation", "Personalised notes", "Ribbon & seals", "Per-employee shipping"],
    pricing: [
      { tier: "Essential", qty: "50 – 149 kits", price: "₹1,499", note: "4-item kit" },
      { tier: "Signature", qty: "150 – 499 kits", price: "₹1,899", note: "6-item premium kit" },
      { tier: "Executive", qty: "500+ kits", price: "₹2,499", note: "Luxury curated kit" },
    ],
    faq: [
      { q: "Can you ship to individual employees?", a: "Yes, we handle pan-India door delivery with per-kit tracking." },
      { q: "Can we run kits monthly?", a: "Most clients keep a buffer stock with us and release monthly batches." },
      { q: "Can we include our own items?", a: "Send them to our facility and we assemble them into the kit." },
    ],
    related: ["corporate-gift-boxes", "packaging", "corporate-uniforms"],
  },
  {
    slug: "corporate-gift-boxes",
    name: "Corporate Gift Boxes",
    short: "Festive, client and milestone gifting with a considered unboxing.",
    hero: images.welcomekit,
    intro:
      "Gifting that reflects the value of the relationship — restrained materials, tactile finishes and packaging designed to be photographed, not discarded.",
    gallery: g(images.welcomekit, images.cap, images.uniform),
    features: [
      { title: "Tiered gifting", copy: "Different builds for clients, leadership and teams." },
      { title: "Foil & emboss", copy: "Hot foil, deboss and soft-touch lamination." },
      { title: "Sustainable options", copy: "Recycled board, plastic-free fill and seed paper cards." },
      { title: "Bulk dispatch", copy: "Address-list upload and courier reconciliation." },
    ],
    materials: [
      { name: "Soft-touch Rigid Board", detail: "Premium matte gift boxes." },
      { name: "Recycled Kraft", detail: "Eco-forward gifting." },
      { name: "Wooden Crate", detail: "Executive-tier presentation." },
    ],
    customization: ["Hot foil stamping", "Emboss / deboss", "Custom sleeves", "Handwritten-style notes", "Gift tags", "Address-wise dispatch"],
    pricing: [
      { tier: "Client", qty: "50 – 199 boxes", price: "₹1,299", note: "3-item gift" },
      { tier: "Premium", qty: "200 – 499 boxes", price: "₹1,999", note: "5-item gift" },
      { tier: "Executive", qty: "500+ boxes", price: "₹2,899", note: "Bespoke build" },
    ],
    faq: [
      { q: "Can you deliver before a festival date?", a: "Book three weeks out for festive windows; we hold slots for Diwali from August." },
      { q: "Do you provide GST-compliant gifting invoices?", a: "Yes, itemised for accounting and compliance." },
      { q: "Can we see a physical sample?", a: "Sample boxes ship in 7 days and cost is adjusted against bulk." },
    ],
    related: ["welcome-kits", "packaging", "promotional-merchandise"],
  },
  {
    slug: "promotional-merchandise",
    name: "Promotional Merchandise",
    short: "Bottles, totes, mugs, lanyards, notebooks and giveaways that get used.",
    hero: images.cap,
    intro:
      "Giveaway merch has one job: stay in circulation. We pick items with genuine daily utility and brand them with finishes that survive real use.",
    gallery: g(images.cap, images.stickers, images.welcomekit),
    features: [
      { title: "Utility-first curation", copy: "We recommend against items that end up in a drawer." },
      { title: "Durable branding", copy: "Laser engraving, pad print and UV print by substrate." },
      { title: "Mixed-item ordering", copy: "Combine categories to hit volume pricing." },
      { title: "Landed cost clarity", copy: "One quote covering branding, packing and freight." },
    ],
    materials: [
      { name: "Stainless Steel", detail: "Bottles and tumblers, laser engraved." },
      { name: "Canvas & Jute", detail: "Totes and pouches." },
      { name: "Ceramic & Bamboo", detail: "Mugs, coasters and desk items." },
    ],
    customization: ["Laser engraving", "Pad printing", "UV printing", "Embroidery", "Custom packaging", "Bundled kits"],
    pricing: [
      { tier: "Giveaway", qty: "100 – 499 pcs", price: "₹199", note: "Entry items" },
      { tier: "Signature", qty: "500 – 1,999 pcs", price: "₹449", note: "Mid-tier items" },
      { tier: "Premium", qty: "2,000+ pcs", price: "₹799", note: "Executive items" },
    ],
    faq: [
      { q: "Can you source a specific product?", a: "Yes — send a reference and we will quote a matched or better item." },
      { q: "Do you offer eco-friendly options?", a: "A full recycled and bamboo range is available." },
      { q: "Minimum per item?", a: "Typically 100 pieces, lower for premium executive items." },
    ],
    related: ["laptop-stickers", "custom-caps", "corporate-gift-boxes"],
  },
  {
    slug: "packaging",
    name: "Packaging",
    short: "Mailers, sleeves, labels and inserts that finish the product properly.",
    hero: images.welcomekit,
    intro:
      "Structural and print packaging engineered around your product — from e-commerce mailers that survive courier handling to retail sleeves that sell off a shelf.",
    gallery: g(images.welcomekit, images.stickers, images.tshirt),
    features: [
      { title: "Structural design", copy: "Dielines built for your exact product dimensions." },
      { title: "Drop tested", copy: "Transit testing before production release." },
      { title: "Print finishing", copy: "Foil, spot UV, soft touch and emboss." },
      { title: "Low-MOQ digital", copy: "Short runs from 100 units for launches." },
    ],
    materials: [
      { name: "E-flute Corrugated", detail: "Protective printed mailers." },
      { name: "Rigid Board", detail: "Premium presentation boxes." },
      { name: "Art Card 300 GSM", detail: "Sleeves, tags and inserts." },
    ],
    customization: ["Custom dielines", "Inside printing", "Tear strips", "Foil & spot UV", "Recycled stock", "Branded tape"],
    pricing: [
      { tier: "Launch", qty: "100 – 499 units", price: "₹89", note: "Printed mailer" },
      { tier: "Scale", qty: "500 – 1,999 units", price: "₹62", note: "Printed mailer" },
      { tier: "Volume", qty: "2,000+ units", price: "₹41", note: "Printed mailer" },
    ],
    faq: [
      { q: "Can you design the dieline?", a: "Yes, structural design is included with production orders." },
      { q: "Do you offer plastic-free packaging?", a: "Paper tape, kraft fill and water-based inks throughout." },
      { q: "How long does tooling take?", a: "New dies take 4–5 days before the print run begins." },
    ],
    related: ["welcome-kits", "corporate-gift-boxes", "waterproof-stickers"],
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export type Industry = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  intro: string;
  useCases: { title: string; copy: string }[];
  popular: string[];
  stat: { value: string; label: string };
};

export const industries: Industry[] = [
  { slug: "corporate", name: "Corporate", tagline: "Uniform programmes, onboarding kits and annual gifting.", image: images.uniform, intro: "We run merchandise as a programme, not a purchase — consistent shades, buffer stock and procurement-friendly paperwork.", useCases: [{ title: "Onboarding kits", copy: "Day-one kits shipped to homes with per-employee tracking." }, { title: "Uniform rollout", copy: "Branch-wise packing across locations with reorder consistency." }, { title: "Annual gifting", copy: "Festive and milestone boxes with address-list dispatch." }], popular: ["corporate-uniforms", "welcome-kits", "corporate-gift-boxes"], stat: { value: "180+", label: "corporate programmes run" } },
  { slug: "schools", name: "Schools", tagline: "House tees, sports day kits and annual uniforms.", image: images.tshirt, intro: "Durable fabrics, honest pricing for parents and size-wise packing per class section.", useCases: [{ title: "House & sports day", copy: "Colour-coded team tees produced in a week." }, { title: "Annual uniforms", copy: "Wash-tested fabrics with section-wise delivery." }, { title: "Graduation merch", copy: "Keepsake hoodies and signature tees." }], popular: ["custom-t-shirts", "corporate-uniforms", "custom-caps"], stat: { value: "60k+", label: "school garments printed" } },
  { slug: "colleges", name: "Colleges", tagline: "Fest merch, department tees and convocation programmes.", image: images.tshirt, intro: "Size collection links, individual names and per-head pricing you can circulate to the batch.", useCases: [{ title: "Fest merchandise", copy: "Fast-turn drops with sponsor placements." }, { title: "Department batch tees", copy: "Individual names and roll numbers included." }, { title: "Campus store", copy: "Ongoing stock for a student-run store." }], popular: ["college-merchandise", "hoodies", "oversized-t-shirts"], stat: { value: "220+", label: "campus programmes" } },
  { slug: "restaurants", name: "Restaurants", tagline: "Front-of-house uniforms, aprons and branded packaging.", image: images.uniform, intro: "Kitchen-tough fabrics and packaging that keeps the brand intact through delivery.", useCases: [{ title: "Service uniforms", copy: "Stain-resistant, industrial-wash tested." }, { title: "Delivery packaging", copy: "Branded sleeves, stickers and tamper seals." }, { title: "Staff merch", copy: "Caps and tees for launches and pop-ups." }], popular: ["corporate-uniforms", "packaging", "custom-caps"], stat: { value: "45+", label: "F&B brands served" } },
  { slug: "hotels", name: "Hotels", tagline: "Department-coded uniforms and premium guest amenities.", image: images.uniform, intro: "Hospitality-grade programmes with laundry-tested garments and consistent reorders.", useCases: [{ title: "Department coding", copy: "Distinct trims per department and seniority." }, { title: "Guest gifting", copy: "In-room amenity kits and welcome boxes." }, { title: "Event linen & merch", copy: "Branded items for banquets and conferences." }], popular: ["corporate-uniforms", "welcome-kits", "corporate-gift-boxes"], stat: { value: "50 cycles", label: "laundry tested" } },
  { slug: "hospitals", name: "Hospitals", tagline: "Scrubs, lab coats and identity-coded staff wear.", image: images.uniform, intro: "Comfort over long shifts, colour-coded by department, and fabrics that hold up to hot-wash protocols.", useCases: [{ title: "Scrubs & coats", copy: "Anti-microbial finish options available." }, { title: "Department coding", copy: "Colour systems for wards and specialities." }, { title: "Awareness campaigns", copy: "Event tees and caps for health drives." }], popular: ["corporate-uniforms", "custom-t-shirts", "promotional-merchandise"], stat: { value: "30+", label: "healthcare clients" } },
  { slug: "sports-clubs", name: "Sports Clubs", tagline: "Match kits, training wear and supporter merchandise.", image: images.jersey, intro: "Roster-driven production, sponsor management and season-long reorder support.", useCases: [{ title: "Match kits", copy: "Home, away and keeper sets with numbering." }, { title: "Training range", copy: "Bibs, shorts and warm-up layers." }, { title: "Fan merch", copy: "Supporter tees, caps and scarves." }], popular: ["sports-jerseys", "custom-caps", "custom-t-shirts"], stat: { value: "9 days", label: "average kit turnaround" } },
  { slug: "startups", name: "Startups", tagline: "Culture merch, hiring kits and conference giveaways.", image: images.welcomekit, intro: "Small MOQs at the start, scaling into full programmes as headcount grows.", useCases: [{ title: "Team merch", copy: "Low-MOQ tees and hoodies that people wear." }, { title: "Conference kits", copy: "Sticker packs and swag that clears the booth." }, { title: "Investor gifting", copy: "Considered boxes for milestone moments." }], popular: ["welcome-kits", "laptop-stickers", "oversized-t-shirts"], stat: { value: "25 pcs", label: "minimum order" } },
  { slug: "ngos", name: "NGOs", tagline: "Volunteer kits, campaign tees and awareness merchandise.", image: images.tshirt, intro: "Cost-transparent production, with subsidised pricing for registered nonprofits.", useCases: [{ title: "Volunteer identity", copy: "Highly visible tees, caps and badges." }, { title: "Campaign drops", copy: "Fast production for awareness weeks." }, { title: "Donor gifting", copy: "Thank-you kits with impact storytelling." }], popular: ["custom-t-shirts", "custom-caps", "promotional-merchandise"], stat: { value: "12%", label: "nonprofit discount" } },
  { slug: "government", name: "Government", tagline: "Tender-compliant supply with documentation and audit trails.", image: images.uniform, intro: "GeM-ready documentation, sample submissions and inspection-friendly production records.", useCases: [{ title: "Departmental uniforms", copy: "Specification-matched bulk supply." }, { title: "Public campaigns", copy: "High-volume awareness merchandise." }, { title: "Event kits", copy: "Delegate kits for official programmes." }], popular: ["corporate-uniforms", "custom-t-shirts", "event-merchandise"], stat: { value: "100%", label: "spec compliance" } },
  { slug: "retail", name: "Retail", tagline: "Store staff wear, retail merch lines and packaging.", image: images.tshirt, intro: "Shelf-ready production with barcoding, folding and retail packing standards.", useCases: [{ title: "Retail merch lines", copy: "Private-label apparel ready for shelf." }, { title: "Store uniforms", copy: "Seasonal refreshes across locations." }, { title: "Packaging systems", copy: "Bags, tags and tissue in one identity." }], popular: ["oversized-t-shirts", "packaging", "corporate-uniforms"], stat: { value: "Barcode", label: "retail-ready packing" } },
  { slug: "real-estate", name: "Real Estate", tagline: "Site team gear, handover kits and client gifting.", image: images.cap, intro: "Field-durable gear for site teams and elevated gifting for buyers at handover.", useCases: [{ title: "Site teams", copy: "Caps, polos and high-visibility wear." }, { title: "Handover kits", copy: "Keys, documents and gifts in one box." }, { title: "Launch events", copy: "Signage, stickers and delegate merch." }], popular: ["custom-caps", "corporate-gift-boxes", "vinyl-stickers"], stat: { value: "48 hrs", label: "site gear dispatch" } },
  { slug: "technology", name: "Technology", tagline: "Developer swag, hackathon kits and hybrid-team gifting.", image: images.stickers, intro: "Swag engineers actually keep — good sticker cuts, right fabrics, no logo-covered filler.", useCases: [{ title: "Developer packs", copy: "Die-cut sticker series and quality tees." }, { title: "Hackathon kits", copy: "Bulk kits shipped to venue on deadline." }, { title: "Remote gifting", copy: "Direct-to-home kits worldwide." }], popular: ["laptop-stickers", "oversized-t-shirts", "welcome-kits"], stat: { value: "3 yr", label: "sticker durability" } },
];

export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  sector: string;
  year: string;
  image: string;
  summary: string;
  problem: string;
  solution: string;
  process: { step: string; copy: string }[];
  materials: string[];
  output: { value: string; label: string }[];
  review: { quote: string; name: string; role: string };
  related: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "vertex-fc-kit-launch",
    title: "Vertex FC Kit Launch",
    client: "Vertex FC",
    sector: "Sports Club",
    year: "2025",
    image: images.jersey,
    summary: "180 sublimated kits, six sponsors, nine days to the season opener.",
    problem: "Vertex FC signed two new sponsors eleven days before their season opener. Their previous supplier had quoted a four-week lead time and could not guarantee that sponsor blocks would sit correctly across all sizes.",
    solution: "We rebuilt the kit artwork as a size-graded template so sponsor blocks scale proportionally from youth XS to adult 3XL, then locked a dedicated sublimation line for a nine-day run including roster personalisation.",
    process: [
      { step: "Design", copy: "Two kit concepts, size-graded sponsor placement, digital mockups approved in 36 hours." },
      { step: "Printing", copy: "Edge-to-edge dye sublimation on 140 GSM micro-poly, transferred at 200°C." },
      { step: "Cut & Sew", copy: "Panel cutting, mesh underarm inserts, flatlock stitching, contrast collar." },
      { step: "QC", copy: "Every kit checked against the roster sheet — name, number, size, sponsor alignment." },
      { step: "Packing", copy: "Bagged and labelled per player, boxed by squad." },
    ],
    materials: ["Micro Poly Dry Fit 140 GSM", "Poly-Spandex Mesh", "Sublimation Inks", "Woven Club Labels"],
    output: [{ value: "180", label: "kits delivered" }, { value: "9", label: "days end to end" }, { value: "6", label: "sponsor placements" }, { value: "0", label: "reprints required" }],
    review: { quote: "The kits landed two days before the opener and every single name was right. We have not looked at another supplier since.", name: "Rohan Iyer", role: "Team Manager, Vertex FC" },
    related: ["kairos-onboarding-kit", "axiom-sticker-series"],
  },
  {
    slug: "kairos-onboarding-kit",
    title: "Kairos Onboarding Kit",
    client: "Kairos",
    sector: "Startup",
    year: "2025",
    image: images.welcomekit,
    summary: "400 welcome kits shipped to home addresses across 14 states.",
    problem: "Kairos grew from 60 to 460 people in a year, fully remote. HR was assembling welcome kits by hand in a meeting room and shipping them individually — a process that consumed roughly nine hours per week.",
    solution: "We designed a single rigid magnetic box with a CNC-cut foam insert, sourced and branded every item, and took over per-employee dispatch with a live tracking sheet shared with HR.",
    process: [
      { step: "Curation", copy: "Item selection tested against a 'would you keep this' internal survey." },
      { step: "Design", copy: "Box artwork, foil logo, foam dieline and printed welcome card." },
      { step: "Printing", copy: "Soft-touch laminated rigid board with hot-foil brand mark." },
      { step: "Assembly", copy: "Kits packed size-matched to each new hire's onboarding form." },
      { step: "Dispatch", copy: "Individual courier with tracking pushed into the HR dashboard." },
    ],
    materials: ["Rigid Board 1200 GSM", "EVA Foam Insert", "Heavyweight Cotton Tee", "Stainless Steel Bottle"],
    output: [{ value: "400", label: "kits shipped" }, { value: "14", label: "states covered" }, { value: "98%", label: "on-time delivery" }, { value: "9 hrs", label: "weekly HR time saved" }],
    review: { quote: "Our day-one experience went from an apologetic email to something people post about. That is a hiring advantage.", name: "Meera Nair", role: "Head of People, Kairos" },
    related: ["northwind-uniform-programme", "vertex-fc-kit-launch"],
  },
  {
    slug: "northwind-uniform-programme",
    title: "Northwind Uniform Programme",
    client: "Northwind",
    sector: "Corporate",
    year: "2024",
    image: images.uniform,
    summary: "A twelve-branch uniform rollout with shade-locked annual reorders.",
    problem: "Every Northwind branch bought its own uniforms locally. Twelve branches meant twelve shades of the same navy, three different logo sizes and no way to reorder consistently.",
    solution: "We reserved a single fabric lot, built a specification document with embroidery coordinates, and set up branch-wise packing with a reorder portal that reproduces the exact original spec.",
    process: [
      { step: "Audit", copy: "Collected existing garments from all twelve branches to define one standard." },
      { step: "Sampling", copy: "Three fabric options, wash-tested to 50 industrial cycles." },
      { step: "Embroidery", copy: "Digitised logo with fixed coordinates across every size." },
      { step: "QC", copy: "Shade card matched against reserved lot at every production batch." },
      { step: "Dispatch", copy: "Cartons labelled by branch, department and size." },
    ],
    materials: ["Pique Cotton 220 GSM", "Poly-Cotton Twill", "Rayon Embroidery Thread", "Custom Buttons"],
    output: [{ value: "2,400", label: "garments year one" }, { value: "12", label: "branches unified" }, { value: "1", label: "reserved fabric lot" }, { value: "3 yrs", label: "programme running" }],
    review: { quote: "For the first time our teams in Kochi and Chandigarh look like the same company.", name: "Anil Raghavan", role: "Admin Director, Northwind" },
    related: ["kairos-onboarding-kit", "axiom-sticker-series"],
  },
  {
    slug: "axiom-sticker-series",
    title: "Axiom Dev Sticker Series",
    client: "Axiom Labs",
    sector: "Technology",
    year: "2025",
    image: images.stickers,
    summary: "A twelve-design waterproof sticker series across three developer conferences.",
    problem: "Axiom's booth swag was not moving. Generic rectangular logo stickers were left in piles at the end of each conference day while competitors' packs disappeared by lunch.",
    solution: "We designed a twelve-piece collectible series — each sticker a contour-cut character from their CLI documentation — printed on holographic and matte vinyl and packed on a branded backing card.",
    process: [
      { step: "Design", copy: "Twelve characters illustrated and vectorised for clean contour cutting." },
      { step: "Printing", copy: "Eight-colour print with white underbase on 90µ vinyl." },
      { step: "Finishing", copy: "Matte laminate on ten designs, holographic on two chase pieces." },
      { step: "QC", copy: "Registration checked on every cut sheet; kiss-cut depth verified." },
      { step: "Packing", copy: "Assembled onto printed backing cards, shrink-wrapped in packs of six." },
    ],
    materials: ["Calendered Vinyl 90µ", "Holographic Vinyl", "Matte Laminate", "Art Card Backing"],
    output: [{ value: "8,000", label: "stickers printed" }, { value: "12", label: "designs in series" }, { value: "3", label: "conferences covered" }, { value: "0", label: "left over on day two" }],
    review: { quote: "People came to the booth asking for the holographic one. That is not something swag usually does.", name: "Dev Sharma", role: "DevRel Lead, Axiom Labs" },
    related: ["vertex-fc-kit-launch", "northwind-uniform-programme"],
  },
];

export const caseBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);

export type Post = {
  slug: string;
  title: string;
  category: string;
  date: string;
  read: string;
  excerpt: string;
  image: string;
  body: { heading: string; copy: string }[];
};

export const posts: Post[] = [
  {
    slug: "dtf-vs-screen-printing",
    title: "DTF vs Screen Printing: which one should your order use?",
    category: "Printing Tips",
    date: "2026-06-18",
    read: "6 min",
    excerpt: "Colour count, quantity and fabric decide the answer — here is the framework we use internally.",
    image: images.tshirt,
    body: [
      { heading: "The short answer", copy: "Below 50 pieces or above four colours, DTF almost always wins on cost and detail. Above 200 pieces with three or fewer colours, screen printing produces a softer hand-feel at a lower unit price." },
      { heading: "Hand-feel matters more than people expect", copy: "Screen ink sits in the fabric; DTF sits on it. For heavyweight streetwear tees where the print is the product, screen or puff gives a more premium result. For photographic artwork, DTF is the only sensible option." },
      { heading: "Durability", copy: "Both survive 40+ washes when cured correctly. Failures almost always come from under-curing, not from the technology itself — which is why we log cure temperature on every run." },
    ],
  },
  {
    slug: "gsm-guide-for-merch",
    title: "A practical GSM guide for merchandise buyers",
    category: "Merchandise",
    date: "2026-05-30",
    read: "5 min",
    excerpt: "180, 240 or 260 GSM? What the number actually changes in the garment you receive.",
    image: images.uniform,
    body: [
      { heading: "What GSM really measures", copy: "Grams per square metre is fabric weight, not quality. A well-knit 180 GSM cotton can outperform a poorly knit 240 GSM one — but within the same yarn quality, higher GSM means more structure and opacity." },
      { heading: "Choosing by use case", copy: "180 GSM for everyday corporate tees and hot climates. 240 GSM for oversized drops where drape defines the silhouette. 260 GSM and above for premium retail-grade merch." },
      { heading: "The shrinkage question", copy: "Always ask for bio-washed or compacted fabric. It costs marginally more and eliminates most of the post-wash shrinkage complaints." },
    ],
  },
  {
    slug: "onboarding-kits-that-work",
    title: "Onboarding kits that new hires actually keep",
    category: "Corporate Gifts",
    date: "2026-05-12",
    read: "7 min",
    excerpt: "The four-item rule, why sizing forms matter, and the items to stop buying.",
    image: images.welcomekit,
    body: [
      { heading: "Four good items beat nine filler ones", copy: "Budget concentrated on fewer, better items produces a stronger day-one impression than a box stuffed with branded pens." },
      { heading: "Ask for the size before you ship", copy: "A tee that does not fit is a wasted item and a bad first signal. A two-field onboarding form solves it." },
      { heading: "Design the unboxing, not just the box", copy: "Order of discovery matters. Note on top, apparel beneath, desk items last." },
    ],
  },
  {
    slug: "brand-colour-consistency",
    title: "Why your brand colour keeps changing across suppliers",
    category: "Branding",
    date: "2026-04-22",
    read: "6 min",
    excerpt: "Pantone references, substrate shift and how to lock a shade across garments and print.",
    image: images.jersey,
    body: [
      { heading: "Screen colours lie", copy: "A hex value renders differently on cotton, polyester and vinyl. Specify Pantone references, and separate ones for textile and print." },
      { heading: "Substrate shift is real", copy: "The same ink on white cotton and grey melange reads as two colours. An underbase layer solves most of it." },
      { heading: "Lock a physical standard", copy: "Approve a physical strike-off once and reference it forever. It is the only reliable control." },
    ],
  },
  {
    slug: "designing-merch-artwork",
    title: "Designing artwork that survives production",
    category: "Design",
    date: "2026-03-28",
    read: "5 min",
    excerpt: "Line weights, trap, bleed and the file setup that prevents avoidable reprints.",
    image: images.stickers,
    body: [
      { heading: "Minimum line weights", copy: "Keep strokes above 0.6 pt for screen and 0.3 pt for DTF. Anything finer breaks up during cure." },
      { heading: "Outline your type", copy: "Convert text to outlines before sending. Missing fonts are the single most common cause of production delays." },
      { heading: "Build for the largest size", copy: "Design at the biggest garment size and scale down. Upscaling raster art at the last moment is where softness creeps in." },
    ],
  },
  {
    slug: "merch-that-markets",
    title: "Merchandise as a marketing channel, not a cost line",
    category: "Marketing",
    date: "2026-02-14",
    read: "8 min",
    excerpt: "How to measure impressions, retention and cost-per-wear on your merch spend.",
    image: images.cap,
    body: [
      { heading: "Cost per wear", copy: "Divide unit cost by realistic wears over a year. A ₹900 hoodie worn 40 times beats a ₹250 tee worn twice." },
      { heading: "Track it like media", copy: "Rough impressions per wear, multiplied by retention, gives a defensible CPM you can put in a marketing deck." },
      { heading: "Design for the wearer, not the brand deck", copy: "The most effective branding is the most restrained. People wear things they like, not things covered in a logo." },
    ],
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);

export const printTech = [
  { name: "DTF", best: "Full-colour, small runs", detail: "Direct-to-film transfer with white underbase. Unlimited colours, photographic detail, no colour setup cost.", minQty: "1 pc", colours: "Unlimited" },
  { name: "Screen Printing", best: "High volume, few colours", detail: "Plastisol and water-based inks pushed through mesh. Softest hand-feel and lowest unit cost at scale.", minQty: "50 pcs", colours: "1 – 8" },
  { name: "Embroidery", best: "Uniforms & caps", detail: "Rayon and poly thread stitched at up to 15,000 stitches. The most durable branding available.", minQty: "25 pcs", colours: "1 – 15" },
  { name: "Heat Transfer", best: "Names & numbers", detail: "Cut vinyl and printed transfers applied under heat. Ideal for personalisation and reflective finishes.", minQty: "1 pc", colours: "1 – 4" },
  { name: "Sublimation", best: "Sports & polyester", detail: "Dye bonded into polyester fibre. Zero surface layer — nothing to crack, peel or fade.", minQty: "10 pcs", colours: "Unlimited" },
  { name: "Laser Engraving", best: "Metal & bamboo", detail: "Permanent mark burned into the substrate. Used for bottles, tumblers and desk items.", minQty: "25 pcs", colours: "Tonal" },
];

export const fabrics = [
  { name: "Combed Cotton", gsm: "180 GSM", feel: "Soft, breathable", use: "Everyday corporate tees" },
  { name: "Heavyweight Cotton", gsm: "240 GSM", feel: "Structured drape", use: "Oversized streetwear" },
  { name: "Dry Fit Poly", gsm: "140 GSM", feel: "Light, wicking", use: "Sports jerseys" },
  { name: "French Terry", gsm: "320 GSM", feel: "Loopback, warm", use: "Premium hoodies" },
  { name: "Canvas", gsm: "280 GSM", feel: "Rigid, durable", use: "Totes and aprons" },
];

export const timeline = [
  { year: "2016", title: "A single heat press", copy: "Xeno Craft started in a 400 sq ft room with one heat press and a college fest order for 60 tees." },
  { year: "2018", title: "First screen line", copy: "A six-colour manual carousel let us take on our first thousand-piece corporate uniform contract." },
  { year: "2020", title: "In-house sublimation", copy: "Sports clubs pushed us into full sublimation. We shipped 40 club kits in our first season." },
  { year: "2022", title: "Packaging division", copy: "Welcome kits demanded control over boxes and inserts, so we brought packaging in-house." },
  { year: "2024", title: "18,000 sq ft facility", copy: "Cutting, printing, embroidery, QC and packing moved under a single roof in Hyderabad." },
  { year: "2026", title: "Design studio online", copy: "Our live configurator lets clients build and preview merchandise before a quote is raised." },
];

export const team = [
  { name: "Arjun Mehta", role: "Founder & Production Head", bio: "Sixteen years on the floor. Signs off on every new fabric before it enters the line." },
  { name: "Sneha Kulkarni", role: "Design Director", bio: "Leads the studio. Turns a brand deck into artwork that survives production." },
  { name: "Imran Qureshi", role: "Quality Lead", bio: "Runs wash tests, cure logs and the shade library. The reason reorders match." },
  { name: "Priya Venkat", role: "Client Programmes", bio: "Owns corporate accounts end to end, from sizing drives to annual reorders." },
];

export const stats = [
  { value: "1.2M+", label: "Products delivered" },
  { value: "900+", label: "Brands served" },
  { value: "18,000", label: "Sq ft facility" },
  { value: "99.2%", label: "On-time dispatch" },
];

export const megaMenu = [
  { group: "Apparel", items: ["custom-t-shirts", "oversized-t-shirts", "hoodies", "sports-jerseys", "corporate-uniforms"] },
  { group: "Campus & Events", items: ["college-merchandise", "event-merchandise", "custom-caps"] },
  { group: "Stickers & Print", items: ["laptop-stickers", "vinyl-stickers", "waterproof-stickers"] },
  { group: "Corporate", items: ["welcome-kits", "corporate-gift-boxes", "promotional-merchandise", "packaging"] },
];
