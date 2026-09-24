/* =========================================================
   Blue Ember Concepts — data.js
   Shared content for every page. When the database is connected,
   these objects are replaced by data fetched from it.
   ========================================================= */

const CONFIG = {
  whatsapp: "18764251995",
  projectEmail: "project@blueemberja.com",
  bizplejDate: null, // e.g. "2026-12-04T19:00:00-05:00" switches the countdown on
  tourKey: "be-tour-seen",
};

const UP = "https://blueemberja.com/wp-content/uploads/2018/04/";

/* Images: the site asks for small local WebP copies in /img (made by `npm run images`).
   If a copy is missing, the browser falls back to the original on blueemberja.com. */
const LOCAL_IMAGES = true;
const localPic = (src, w) => `img/${src.slice(UP.length).replace(/\.[a-z]+$/i, "")}-${w}.webp`;
/* Returns the src + fallback attributes for an <img>. w: 320 (tiny), 640 (cards), 1400 (full screen) */
function imgAttrs(src, w = 640, extraFallback = "") {
  if (!LOCAL_IMAGES || !src.startsWith(UP)) return `src="${src}"${extraFallback ? ` data-fallback="${extraFallback}"` : ""}`;
  return `src="${localPic(src, w)}" data-fallback="${[src, extraFallback].filter(Boolean).join("|")}"`;
}
/* Same, for setting an existing <img> from script (the lightbox) */
function setPic(el, src, w = 1400) {
  if (LOCAL_IMAGES && src.startsWith(UP)) { el.dataset.fallback = src; el.src = localPic(src, w); }
  else { delete el.dataset.fallback; el.src = src; }
}
const img = (file, caption) => ({ src: UP + file, caption });

const PROJECTS = [
  {
    id: "ironade",
    client: "Wisynco",
    title: "Ironade: from concept to shelf",
    meta: "Brand development, social, print and point of sale",
    tags: ["design", "digital", "display"],
    cover: UP + "Ironade-Concept-Posters_1.jpg",
    fan: ["Ironade-12-X-18-Poster_Wild.jpg", "Ironade-12-X-18-Poster_Tropical.jpg", "Ironade-12-X-18-Poster_Orange.jpg"],
    story: [
      "When Wisynco, the Jamaican manufacturer and distributor behind more than 110 brands, prepared to launch a new energy drink, they called Blue Ember.",
      "We grew Ironade from the first idea to the shelf. It began with the line that became the brand’s promise, “Transform Your Energy”, and carried through every touchpoint: motion graphics, social campaigns, billboards, banners, shelf hangers and t-shirts.",
      "Ironade launched in three flavours, wild berry, orange and tropical. Each needed its own voice while the range still read as one brand.",
    ],
    deliverables: ["Slogan and brand development", "Motion graphics", "Social media campaigns", "Billboards and banners", "Shelf hangers and lit towers", "T-shirts and promo items"],
    result: "Stocked in more than 3,000 locations islandwide",
    gallery: {
      Print: [
        img("Ironade-Concept-Posters_1.jpg", "Concept poster"),
        img("Ironade-Concept-Posters_2.jpg", "Concept poster"),
        img("Ironade-Concept-Posters_3.jpg", "Concept poster"),
        img("Ironade-Concept-Posters_4.jpg", "Concept poster"),
        img("Ironade-12-X-18-Poster.jpg", "12 × 18 poster"),
        img("Ironade-12-X-18-Poster_Wild.jpg", "Wild berry poster"),
        img("Ironade-12-X-18-Poster_Orange.jpg", "Orange poster"),
        img("Ironade-12-X-18-Poster_Tropical.jpg", "Tropical poster"),
        img("Ironade-Sale-Sheet_bleed.jpg", "Sale sheet"),
        img("Ironade_T-shirt-Proposal.jpg", "T-shirt design"),
      ],
      Social: [
        img("Ironade-Social-Media-Post_NEW-1200x600.jpg", "Launch post"),
        img("Ironade-Social-Media-Post_Flavours_Orange-1200x600.jpg", "Orange flavour post"),
        img("Ironade-Social-Media-Post-2_1.jpg", "Campaign post"),
        img("Ironade-Social-Media-Post-2_2.jpg", "Campaign post"),
        img("Ironade-Social-Media-Post-2_3.jpg", "Campaign post"),
        img("Ironade-IG-Post_TransformYourEnergy.jpg", "Transform Your Energy post"),
        img("Ironade-IG-Post_Benefit-of-Tropical.jpg", "Tropical benefits post"),
        img("Ironade_Ingredients_Tropical.jpg", "Tropical ingredients post"),
        img("Ironade-transfrom-run-1200x1200.jpg", "Transform run post"),
        img("Ironade_Social-Media-Post_World-Teachers-day.jpg", "World Teachers’ Day post"),
        img("Ironade_Social-Media-Post_Heroes-Day.jpg", "Heroes Day post"),
        img("Ironade-IG-Post_Happy-Monday2.jpg", "Happy Monday post"),
        img("Ironade_Tip-the-Scale-Post.jpg", "Tip the Scale post"),
        img("Ironade_getHighonEnergy.jpg", "Energy post"),
        img("Ironade-IG-Post-2.jpg", "Instagram post"),
        img("Ironade-IG-Post-7.jpg", "Instagram post"),
        img("Ironade_Fb-Banner-3.jpg", "Facebook banner"),
        img("Ironade_Fb-Banner-3B.jpg", "Facebook banner"),
        img("Ironade_Fb-Banner-3c.jpg", "Facebook banner"),
      ],
      Display: [
        img("Ironade_Feather-Pull-Up-Banner-Proposal-1200x1553.jpg", "Feather and pull-up banners"),
        img("Ironade-Lit-Tower-1200x1553.jpg", "Lit tower"),
        img("Ironade-Vertical-Flavour-Banner_Orange.jpg", "Vertical flavour banner"),
      ],
    },
    videos: [],
  },
  {
    id: "mccu",
    client: "Manchester Co-operative Credit Union",
    title: "A rebrand that won the parish",
    meta: "Brand development, campaigns, TV and radio",
    tags: ["design", "digital", "display"],
    cover: UP + "Manchester_Coop-1.jpg",
    fan: ["4x6-Car-Loan.jpg", "Anniversary-basket-updated.jpg", "PropertyLoan-18x24-1.jpg"],
    story: [
      "Manchester Co-operative Credit Union is our longest-standing client. We took on its complete brand development, then kept the new brand working through a steady run of planned campaigns.",
      "Our team produced vehicle wraps, banners, feather banners and flyers, then followed with radio and television ads designed to bring new members through the door.",
    ],
    deliverables: ["Complete brand development", "Vehicle wraps and banners", "Flyers and promotional items", "Television and radio ads"],
    result: "Most Outstanding Parish Credit Union of the Year 2016–17",
    quote: {
      text: "Blue Ember played a vital role in us achieving and maintaining this award. Their help in rebranding and the overall promotion of our union was so necessary. With their help the public knows more about our services.",
      by: "Michael Gottshalk, Director",
    },
    gallery: {
      Print: [
        img("4x6-Car-Loan.jpg", "Car loan flyer"),
        img("PropertyLoan-18x24-1.jpg", "Property loan poster"),
      ],
      Promo: [img("Anniversary-basket-updated.jpg", "Anniversary gift basket")],
    },
    videos: ["y-ChJMd4g2s", "Sf-yoXkcM6s", "tTi3kXXjL7I", "zdlGI4P22h0"],
  },
  {
    id: "usf",
    client: "Universal Service Fund",
    title: "Nation builders helping nation builders",
    meta: "Brand rebuild, press, social and events",
    tags: ["design", "digital", "display"],
    cover: UP + "USF.jpg",
    fan: ["feather-banners-1200x1553.jpg", "USF-pullup-Banner2.jpg", "USF-connect-Social-Media-1200x1553.jpg"],
    coverFallback: UP + "USF-400x267.jpg",
    story: [
      "The Universal Service Fund, an agency under the Ministry of Science, Energy and Technology, works to put information and communication tools within reach of every Jamaican.",
      "Working side by side with its public relations and marketing teams, we rebuilt the brand from the ground up, from motion to print, including a ministry event led by Dr. the Hon. Andrew Wheatley.",
      "The work extended to sister agencies ENSOL, E-Learning Jamaica and the Petroleum Corporation of Jamaica. For E-Learning Jamaica we helped with digital, motion and photography.",
    ],
    deliverables: ["Brand rebuild", "Gleaner and Observer ads", "Social media", "Pull-up and feather banners", "Event support", "Motion and photography"],
    result: "One brand system across USF and three sister agencies",
    gallery: {
      Print: [
        img("USF-ad-CEO.jpg", "CEO feature ad"),
        img("USF-Gleaner-Ad.jpg", "Gleaner ad"),
        img("USF-observer-ad-new.jpg", "Observer ad"),
      ],
      Social: [
        img("USF-connect-Social-Media-1200x1553.jpg", "USF Connect post"),
        img("FB-teachers-day.jpg", "Teachers’ Day post"),
        img("USF-Social-Media-Flyer-Layout-1.jpg", "Social flyer"),
        img("USF-Social-Media-Frame-Proposal.jpg", "Social frame"),
      ],
      Display: [
        img("USF-pullup-Banner2.jpg", "Pull-up banner"),
        img("feather-banners-1200x1553.jpg", "Feather banners"),
      ],
    },
    videos: ["bUJqsRKkfEM"],
  },
  {
    id: "sutherland",
    client: "Sutherland Global Services",
    title: "Design, development and delivery",
    meta: "Print production and promotional items",
    tags: ["design", "display"],
    cover: UP + "Southerland-Global5.jpg",
    fan: ["Southerland-Global3.jpg", "Sutherland-Global-UWI-3-updated.jpg", "Southerland-Global5.jpg"],
    story: [
      "Sutherland operates in more than 19 countries and kept expanding across Jamaica. Growth at that pace needs a constant supply of materials.",
      "We became their in-house print partner, handling promotional items, print production and on-demand support for activities and staff training.",
    ],
    deliverables: ["Promotional items", "Print production", "Activity and training materials"],
    result: "Ongoing print partner through islandwide growth",
    quote: { text: "The team has helped us keep up with our ever growing team islandwide.", by: "Sutherland Global Services" },
    gallery: {
      Print: [
        img("Southerland-Global.jpg", "Print production"),
        img("Southerland-Global3.jpg", "Print production"),
        img("Southerland-Global5.jpg", "Print production"),
        img("sample4-1200x927.jpg", "Print production"),
        img("sample-2.20.17-1200x927.jpg", "Print production"),
        img("Sutherland-Global-UWI-3-updated.jpg", "Activity materials"),
      ],
    },
    videos: [],
  },
];

/* Demo account for the client desk. Replaced by real accounts later. */
const DESK_DEMO = {
  client: "Manchester Co-operative Credit Union",
  items: [
    { id: "car-loan", name: "Car loan flyer", spec: "4 × 6 in, full colour, packs of 100", last: "Last ordered March 2026", src: UP + "4x6-Car-Loan.jpg", step: 100, unit: "flyers" },
    { id: "property-loan", name: "Property loan poster", spec: "18 × 24 in, gloss", last: "Last ordered January 2026", src: UP + "PropertyLoan-18x24-1.jpg", step: 1, unit: "posters" },
    { id: "gift-basket", name: "Anniversary gift basket", spec: "Branded basket, tags and wrap", last: "Last ordered October 2025", src: UP + "Anniversary-basket-updated.jpg", step: 1, unit: "baskets" },
  ],
};

/* Posts shown on the 3D phone screens */
const PHONE_FEED = [
  { name: "Ironade", src: UP + "Ironade-IG-Post_TransformYourEnergy.jpg", caption: "Transform your energy." },
  { name: "Universal Service Fund", src: UP + "FB-teachers-day.jpg", caption: "Happy Teachers’ Day to the nation builders." },
  { name: "Ironade", src: UP + "Ironade-Social-Media-Post_Flavours_Orange-1200x600.jpg", caption: "Orange is here." },
  { name: "Ironade", src: UP + "Ironade_Social-Media-Post_Heroes-Day.jpg", caption: "Celebrating our heroes." },
  { name: "Universal Service Fund", src: UP + "USF-connect-Social-Media-1200x1553.jpg", caption: "Connecting every Jamaican." },
  { name: "Ironade", src: UP + "Ironade-IG-Post-7.jpg", caption: "Three flavours. One energy." },
];
