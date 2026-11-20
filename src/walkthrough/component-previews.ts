/**
 * Where each component can be seen on its own. The preview loads the page the component lives on —
 * a design board, a first-pass design, or the live site — and crops the frame to that one element.
 *
 *   src       board name (rendered from design/canvas or design/first-pass) or a live site path
 *   selector  the element to show (first match, or `nth`)
 *   live      a live site page: the frame keeps a normal viewport height and scrolls to the element
 *   open      click this first (drawers and dialogs that open on demand)
 *   phone     also show it at phone width
 *   firstPass a first design for a component no template board draws yet — shown for review
 */
export type Preview = {
  src: string;
  selector: string;
  nth?: number;
  live?: boolean;
  open?: string;
  phone?: boolean;
  firstPass?: boolean;
  caption?: string;
};

const fp = (name: string, caption?: string): Preview => ({ src: `FirstPass-${name}`, selector: 'body > .dy', phone: true, firstPass: true, caption });

export const previews: Record<string, Preview> = {
  // Global
  SiteHeader: { src: 'SiteHeader', selector: 'header.dy-header', phone: true },
  SiteFooter: { src: 'SiteFooter', selector: 'footer.dy-footer', phone: true },
  RolesDrawer: { src: '/', selector: 'dialog.dy-dialog--drawer[open]', live: true, open: '.dy-header-job button', caption: 'Opened from Find a job, on the live site.' },
  ResultsBar: { src: 'T02Investors', selector: 'aside.dye-bar', phone: true },
  AlertBanner: fp('AlertBanner'),
  HomepagePopup: fp('HomepagePopup'),
  ConsentBanner: fp('ConsentBanner', 'The consent tool supplies the banner; this shows how it should sit on the site.'),
  // Heroes and page navigation
  Hero: { src: '/', selector: 'section.dy-hero', live: true, phone: true, caption: 'Live on the homepage.' },
  InteriorHero: { src: 'T03WhoWeAre', selector: 'main > section.dy-ihero', phone: true },
  PageIndex: { src: 'T04Safety', selector: '.dy-toc', caption: 'The sticky “On this page” list. The jump row under a hero is the other variant.' },
  // Content blocks
  RichTextSection: { src: 'T04Sustainability', selector: '.dy-topic-body > *', phone: true },
  MediaText: { src: 'T04Safety', selector: '.dy-fifty', phone: true },
  FeatureColumns: { src: 'T03WhoWeAre', selector: 'main > section:has(.dy-promo)', phone: true },
  ProcessSteps: { src: 'T04Safety', selector: '.dy-steps', phone: true },
  Lifecycle: { src: 'T03WhatWeDo', selector: 'main > section:has(.dy-route)', phone: true },
  Statement: { src: 'T04Safety', selector: '.dy-quote', phone: true },
  MetricBand: { src: 'T03WhoWeAre', selector: 'section.dy-facts', phone: true },
  Accordion: { src: 'T04Safety', selector: '.dy-acc', phone: true },
  Video: { src: 'T02Investors', selector: 'section.dye-film', phone: true },
  InPageSlider: { src: 'T07Careers', selector: 'main > section:has(.dyb-slider)', phone: true },
  Notice: { src: 'T07Careers', selector: 'main > section:has(.dyb-notice)', phone: true },
  // Cards and collections
  Pathways: { src: '/', selector: '.dy-pathways', live: true, phone: true, caption: 'Live on the homepage.' },
  TileGrid: { src: 'T03WhoWeAre', selector: 'main > section:has(.dy-tiles)', phone: true },
  LinkColumns: { src: 'T02Investors', selector: 'main > section:has(.dye-cols)', phone: true },
  CoverCards: { src: 'T02Investors', selector: 'main > section:has(.dye-reports)', phone: true },
  PeopleGrid: { src: 'T15People', selector: 'main > section:has(.dy-people)' },
  EventTimeline: { src: 'T10Events', selector: 'main > section:has(.dyc-timeline)', phone: false },
  // Search, lists and data
  SearchFilterBar: { src: 'T06Directory', selector: 'main > section:has(.dy-filters)', phone: true },
  ResultList: { src: 'T10Listing', selector: '.dyc-results', phone: true },
  JobList: { src: 'T08Search', selector: '.dyb-results', phone: true },
  DocumentList: { src: 'T12Library', selector: 'main > section:has(.dy-docs)', phone: true },
  DataTable: fp('DataTable'),
  EmptyState: { src: 'T08SearchEmpty', selector: 'main > section:has(.dyb-empty)' },
  ArticleBody: { src: 'T11Article', selector: '.dyc-article', phone: true },
  // Companies and careers
  CompanyMap: { src: 'T06Directory', selector: 'section.dy-mapband', caption: 'Desktop and tablet only — on phones the directory carries the chapter.' },
  CompanyDirectoryGrid: { src: 'T06Directory', selector: 'main > section:has(.dy-cogrid)', phone: true },
  TradeFinder: { src: 'T07Careers', selector: 'main > section:has(.dyb-fit)', phone: true },
  RelatedCareers: { src: 'T05Wireline', selector: 'main > section:has(.dy-careers)', phone: true },
  JobDetail: { src: 'T09Job', selector: 'main > .dy-section', phone: true },
  // Forms, closing and layout
  InquiryForm: { src: 'T13Contact', selector: '.dy-f-panel', phone: true },
  ContactOptions: { src: 'T13Contact', selector: '.dy-reach', phone: true },
  ClosingBand: { src: 'T03WhoWeAre', selector: 'section.dy-cta', phone: true },
  SplitSection: { src: 'T02Investors', selector: 'main > section:has(.dye-split)', caption: 'The layout itself: two columns, each holding its own component.' },
  // Required, not yet designed — first designs for review
  Testimonials: fp('Testimonials'),
  ImageGallery: fp('ImageGallery'),
  SocialFeed: fp('SocialFeed'),
  BusinessSegments: fp('BusinessSegments'),
};

export const previewSrc = (p: Preview) => (p.src.startsWith('/') ? p.src : `/walkthrough-assets/canvas/boards/${p.src}.html`);
