import tshirt from "@/assets/tshirt.jpg";
import jersey from "@/assets/jersey.jpg";
import stickers from "@/assets/stickers.jpg";
import weddingcards from "@/assets/weddingcards.jpg";

export const images = { tshirt, jersey, stickers, weddingcards };

export const categories = [
  {
    title: "Custom T-Shirts",
    copy: "Made for your team, event or idea. Custom T-shirts for corporate events, sports events, college fests, corporate gifting, teams, celebrations and more.",
    image: tshirt,
    link: "/custom-t-shirts",
    cta: "Explore Custom T-Shirts",
  },
  {
    title: "Wedding Invitations",
    copy: "Designed around your celebration. Custom wedding invitations created around your wedding style, theme, colours and details.",
    image: weddingcards,
    link: "/wedding-cards",
    cta: "Explore Wedding Cards",
  },
  {
    title: "Stickers",
    copy: "Small stickers. Plenty of personality. Explore Xeno Craft's creative sticker collection for laptops, bottles, notebooks and more. Available exclusively on Amazon.",
    image: stickers,
    link: "/stickers",
    cta: "Shop on Amazon",
    external: true,
  },
];

export const tShirtUseCases = [
  {
    title: "Corporate Events",
    desc: "Custom branded T-shirts for conferences, launches, team events and company activities.",
  },
  {
    title: "Corporate Gifting",
    desc: "Custom T-shirts for employee gifting, client gifting and promotional requirements.",
  },
  {
    title: "Sports Events & Teams",
    desc: "Customised T-shirts for tournaments, sporting events, teams and participants.",
  },
  {
    title: "College Fests",
    desc: "Custom T-shirts for college festivals, clubs, departments and student teams.",
  },
  {
    title: "Events & Celebrations",
    desc: "Personalised T-shirts for events, trips, reunions, celebrations and group occasions.",
  },
  {
    title: "Brands & Communities",
    desc: "Custom T-shirts for brands, campaigns, creators, organisations and communities.",
  },
];

export const tShirtCategories = [
  {
    name: "Classic Cotton T-Shirt",
    desc: "Comfortable everyday T-shirt ready for your custom design.",
    price: "From ₹349",
    type: "Classic T-Shirt",
    image: tshirt,
  },
  {
    name: "Oversized T-Shirt",
    desc: "Relaxed oversized fit for custom artwork, graphics and event designs.",
    price: "From ₹499",
    type: "Oversized T-Shirt",
    image: tshirt,
  },
  {
    name: "Dry-Fit / Sports T-Shirt",
    desc: "Performance T-shirt suitable for sports events, teams and tournaments.",
    price: "From ₹399",
    type: "Dry-Fit / Sports T-Shirt",
    image: jersey,
  },
  {
    name: "Polo T-Shirt",
    desc: "Custom polo T-shirts for corporate events, organisations and teams.",
    price: "From ₹449",
    type: "Polo T-Shirt",
    image: tshirt,
  },
];

export const marqueeItems = [
  "CUSTOM T-SHIRTS",
  "CORPORATE EVENTS",
  "SPORTS EVENTS",
  "COLLEGE FESTS",
  "WEDDING INVITATIONS",
  "STICKERS",
  "CORPORATE GIFTING",
  "CUSTOM T-SHIRTS",
];
