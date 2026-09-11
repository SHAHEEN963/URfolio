/**
 * The complete, editable content of the URfolio site. Every string, number,
 * price and link the visitor can see lives here — components only lay it out.
 *
 * A value written as a literal `[bracket]`, or typed as the string `"[X]"` /
 * `"[ ]"`, is a real placeholder: something the brief left for the owner to
 * fill in, not a real number or client. Components render those visibly
 * (dashed outline) instead of inventing data — see `components/ui/Placeholder.tsx`.
 * Run `npm run check-placeholders` before launch to list everything still open.
 */

export type Audience = "individual" | "company";

/** A number that may still be an unfilled placeholder. */
export type Maybe<T extends string> = number | T;

export function isPh<T extends string>(v: Maybe<T>): v is T {
  return typeof v === "string";
}

// ─── Nav ─────────────────────────────────────────────────────────────────

export type NavLink = { label: string; href: string };

export const nav = {
  links: [
    { label: "Home", href: "#top" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ] satisfies NavLink[],
  cta: "Start your folio",
};

// ─── Hero ────────────────────────────────────────────────────────────────

export const hero = {
  toggle: { individual: "Individual", company: "Company" },
  headline: ["Your portfolio.", "Built with AI,", "finished by hand."],
  sub: {
    individual:
      "Send us your CV and your best work. We turn it into a one-page portfolio that gets you hired — live in 7 days.",
    company:
      "Send us your services and projects. We turn them into a sharp company profile that wins clients — live in 7 days.",
  } satisfies Record<Audience, string>,
  ctaPrimary: "Start your folio",
  ctaSecondary: "See examples",
  trustChips: ["120+ sites launched", "Reply within 24 hours", "Rated 4.9/5"],
  namePrompt: "Type your name",
  preview: {
    individual: { name: "Lina Haddad", role: "Brand Photographer", domain: "lina-haddad.com" },
    company: { name: "Northline Studio", role: "Architecture & Interiors", domain: "northline-studio.com" },
  } satisfies Record<Audience, { name: string; role: string; domain: string }>,
  previewStatus: ["Drafting layout…", "Applying your palette…", "Publishing…", "Published"],
};

// ─── Marquee ─────────────────────────────────────────────────────────────

export const marquee = {
  words: [
    "Designers",
    "Photographers",
    "Consultants",
    "Engineers",
    "Studios",
    "Agencies",
    "Startups",
    "Freelancers",
  ],
};

// ─── Statement ───────────────────────────────────────────────────────────

export const statement = {
  text:
    "Talent isn't the problem. Visibility is. A PDF CV and a scattered Instagram don't close deals. A portfolio does — and now it takes days, not months.",
};

// ─── Audiences ───────────────────────────────────────────────────────────

export type AudiencePanel = {
  audience: Audience;
  eyebrow: string;
  heading: string[];
  points: string[];
  cta: string;
};

export const audiences: { heading: string; panels: AudiencePanel[] } = {
  heading: "Built for two kinds of client",
  panels: [
    {
      audience: "individual",
      eyebrow: "For individuals",
      heading: ["Get hired,", "get booked."],
      points: [
        "Personal story & positioning",
        "Selected work with case notes",
        "Skills and experience",
        "Contact & booking links",
        "CV download",
      ],
      cta: "Build my portfolio",
    },
    {
      audience: "company",
      eyebrow: "For companies",
      heading: ["Look as good", "as your work."],
      points: [
        "Services & offer",
        "Project showcase",
        "Team and clients",
        "Trust signals",
        "Lead form & WhatsApp",
      ],
      cta: "Build our company site",
    },
  ],
};

// ─── Process ─────────────────────────────────────────────────────────────

export type ProcessStep = { number: string; title: string; description: string };

export const process: { heading: string; steps: ProcessStep[] } = {
  heading: "How it works",
  steps: [
    {
      number: "01",
      title: "Brief",
      description: "Share your CV, work and links. 10-minute form, no writing needed.",
    },
    {
      number: "02",
      title: "AI draft",
      description: "AI structures your story, writes first-draft copy and proposes a layout.",
    },
    {
      number: "03",
      title: "Human polish",
      description: "A designer refines every detail: type, imagery, flow, tone.",
    },
    {
      number: "04",
      title: "Launch",
      description: "Live on your domain with SEO, analytics and fast loading built in.",
    },
  ],
};

// ─── Work ────────────────────────────────────────────────────────────────

export type WorkType = "Personal" | "Company";

export type WorkItem = {
  id: string;
  number: string;
  title: string;
  type: WorkType;
  year: string;
  /** Deterministic seed for the generated placeholder visual — see WorkVisual.tsx. */
  seed: number;
  result: string;
  /** External link — null until a real site exists behind this sample. */
  link: string | null;
};

export const work: { heading: string; count: string; items: WorkItem[] } = {
  heading: "Selected portfolios",
  count: "06 samples",
  items: [
    {
      id: "photographer",
      number: "01",
      title: "Brand photographer · sample",
      type: "Personal",
      year: "2025",
      seed: 1,
      result: "Fully booked for the next quarter within two weeks of launch.",
      link: null,
    },
    {
      id: "architecture",
      number: "02",
      title: "Architecture studio · sample",
      type: "Company",
      year: "2025",
      seed: 2,
      result: "Landed three commercial pitches directly from the new site.",
      link: null,
    },
    {
      id: "product-designer",
      number: "03",
      title: "Product designer · sample",
      type: "Personal",
      year: "2024",
      seed: 3,
      result: "Hired by a Series B startup after a recruiter found the portfolio.",
      link: null,
    },
    {
      id: "coffee-roaster",
      number: "04",
      title: "Specialty coffee roaster · sample",
      type: "Company",
      year: "2025",
      seed: 4,
      result: "Wholesale inquiries doubled in the first month.",
      link: null,
    },
    {
      id: "consultant",
      number: "05",
      title: "Management consultant · sample",
      type: "Personal",
      year: "2024",
      seed: 5,
      result: "Closed two retainer clients sourced straight from the site.",
      link: null,
    },
    {
      id: "engineer",
      number: "06",
      title: "Software engineer · sample",
      type: "Personal",
      year: "2025",
      seed: 6,
      result: "Three interview offers in the first week of sharing the link.",
      link: null,
    },
  ],
};

// ─── Before / After ──────────────────────────────────────────────────────

export const beforeAfter = {
  heading: "Same person. Same work. Different first impression.",
  toggle: { without: "Without URfolio", with: "With URfolio" },
  caption: { without: "Easy to ignore.", with: "Hard to forget." },
  persona: hero.preview.individual,
};

// ─── Proof ───────────────────────────────────────────────────────────────

export type Metric = { value: Maybe<"[X]">; suffix: string; label: string };

export type Testimonial = { id: string; quote: string; name: string; role: string };

export const proof: { metrics: Metric[]; testimonials: Testimonial[]; instrument: { heading: string; note: string } } = {
  metrics: [
    { value: 120, suffix: "+", label: "sites launched" },
    { value: 14, suffix: "", label: "countries" },
    { value: 7, suffix: "", label: "avg. days to launch" },
    { value: 4.9, suffix: "/5", label: "client rating" },
  ],
  testimonials: [
    {
      id: "t1",
      quote:
        "I sent over my CV and a folder of photos on a Sunday. By the following week I had a site I was actually proud to share.",
      name: "Yousef Nasser",
      role: "Brand Photographer",
    },
    {
      id: "t2",
      quote:
        "The AI draft nailed our tone on the first pass, and the designer's polish made it feel genuinely custom, not templated.",
      name: "Farah Aziz",
      role: "Founder, Northline Studio",
    },
    {
      id: "t3",
      quote: "Fastest turnaround of any agency I've used, and the only one that still felt hand-finished.",
      name: "Karim Haddad",
      role: "Management Consultant",
    },
    {
      id: "t4",
      quote: "Recruiters started reaching out within days of putting the link on my profile.",
      name: "Sara Malik",
      role: "Product Designer",
    },
  ],
  instrument: {
    heading: "Your visit, measured",
    note: "Measured on your device, just now. Every URfolio site is built to this standard.",
  },
};

// ─── Pricing ─────────────────────────────────────────────────────────────

export type PricingPlan = {
  id: "personal" | "professional" | "company";
  name: string;
  price: Maybe<"[ ]">;
  currency: "AED";
  featured: boolean;
  features: string[];
  cta: string;
};

export const pricing: { heading: string; note: string; plans: PricingPlan[] } = {
  heading: "Pricing",
  note: "Need something bigger? Tell us in the brief.",
  plans: [
    {
      id: "personal",
      name: "Personal",
      price: 2500,
      currency: "AED",
      featured: false,
      features: [
        "One-page portfolio",
        "AI draft + designer polish",
        "Up to 6 projects",
        "2 revision rounds",
        "Launch on your domain",
      ],
      cta: "Choose Personal",
    },
    {
      id: "professional",
      name: "Professional",
      price: 4500,
      currency: "AED",
      featured: true,
      features: [
        "Everything in Personal",
        "Custom copywriting",
        "Case study layouts",
        "SEO setup",
        "Analytics",
        "3 revision rounds",
      ],
      cta: "Choose Professional",
    },
    {
      id: "company",
      name: "Company",
      price: 6500,
      currency: "AED",
      featured: false,
      features: [
        "One-page company profile",
        "Services & projects",
        "Team & clients",
        "Lead form + WhatsApp",
        "Optional Arabic version",
      ],
      cta: "Choose Company",
    },
  ],
};

// ─── FAQ ─────────────────────────────────────────────────────────────────

export type FaqItem = { id: string; question: string; answer: string };

export const faq: { heading: string; items: FaqItem[] } = {
  heading: "Questions",
  items: [
    {
      id: "write-content",
      question: "Do I need to write the content?",
      answer:
        "No. Send your CV, links and work — AI drafts the copy, a designer refines it, you approve.",
    },
    {
      id: "all-ai",
      question: "Is it all AI?",
      answer: "No. AI handles the first draft and speed. A designer makes every final decision.",
    },
    {
      id: "how-long",
      question: "How long does it take?",
      answer: "Most sites launch in 7 days after we receive your materials.",
    },
    {
      id: "update-later",
      question: "Can I update it later?",
      answer:
        "Yes. Every site includes a short window of free polish requests right after launch, and an optional ongoing care plan covers updates after that.",
    },
    {
      id: "domain-hosting",
      question: "Do you handle domain and hosting?",
      answer: "Yes, we set up your domain, hosting and analytics.",
    },
    {
      id: "arabic",
      question: "Can my site be in Arabic?",
      answer: "Yes, bilingual Arabic/English is available on request.",
    },
  ],
};

// ─── Contact ─────────────────────────────────────────────────────────────

export type ChipOption<T extends string = string> = { value: T; label: string };

export const contactForm = {
  heading: "Let's build yours.",
  sub: "Answer a few taps. We reply within 24 hours.",
  iAm: {
    label: "I am",
    options: [
      { value: "individual", label: "Individual" },
      { value: "company", label: "Company" },
    ] satisfies ChipOption<Audience>[],
  },
  need: {
    label: "I need",
    options: [
      { value: "new", label: "New portfolio" },
      { value: "redesign", label: "Redesign" },
      { value: "unsure", label: "Not sure yet" },
    ] satisfies ChipOption[],
  },
  plan: {
    label: "Plan",
    options: [
      { value: "personal", label: "Personal" },
      { value: "professional", label: "Professional" },
      { value: "company", label: "Company" },
      { value: "unsure", label: "Not sure" },
    ] satisfies ChipOption[],
  },
  budget: {
    label: "Budget",
    options: [
      { value: "r1", label: "AED 2,000–4,000" },
      { value: "r2", label: "AED 4,000–7,000" },
      { value: "r3", label: "AED 7,000+" },
      { value: "unsure", label: "Not sure" },
    ] satisfies ChipOption[],
  },
  fields: {
    name: { label: "Name", placeholder: "Your name" },
    email: { label: "Email", placeholder: "you@email.com" },
    whatsapp: { label: "WhatsApp (optional)", placeholder: "+971 5X XXX XXXX" },
    link: { label: "Link to current work (optional)", placeholder: "https://…" },
    message: { label: "Message (optional)", placeholder: "Anything else we should know?" },
  },
  submit: "Send my brief",
  success: "Brief received. We'll reply within 24 hours.",
  errors: {
    name: "Enter your name so we know who's writing.",
    email: "Enter a valid email so we can reply.",
    required: "Choose an option to continue.",
  },
  whatsappPrompt: "Prefer WhatsApp? Message us",
};

// ─── Footer ──────────────────────────────────────────────────────────────

export const footer = {
  wordmark: "URfolio",
  tagline: "Based in the UAE. Building portfolios worldwide.",
  backToTop: "Back to top",
};

// ─── Contact details (shared by nav, signature/footer, WhatsApp CTAs) ────

export type SocialLink = { id: string; label: string; href: string };

export type Contact = {
  email: string;
  whatsapp: string;
  whatsappDisplay: string;
  socials: SocialLink[];
};

export const contact: Contact = {
  email: "shaheen@urfolio.net",
  whatsapp: "+963988824456",
  whatsappDisplay: "+963 988 824 456",
  // Social links left empty on purpose — see components/ui/Placeholder.tsx
  // and lib/contact-links.ts `mailHref`/`whatsappHref`. Each renders as a
  // disabled placeholder until a real URL is filled in.
  socials: [
    { id: "instagram", label: "Instagram", href: "" },
    { id: "linkedin", label: "LinkedIn", href: "" },
    { id: "behance", label: "Behance", href: "" },
  ],
};

// ─── SEO ─────────────────────────────────────────────────────────────────

export const meta = {
  title: "URfolio — Portfolio websites built with AI, finished by hand",
  description:
    "URfolio builds one-page portfolio websites for individuals and companies: AI drafts the structure and copy, a human designer refines every detail, and your site launches on your own domain.",
};

export const site = {
  nav,
  hero,
  marquee,
  statement,
  audiences,
  process,
  work,
  beforeAfter,
  proof,
  pricing,
  faq,
  contactForm,
  footer,
  contact,
  meta,
};

export default site;
