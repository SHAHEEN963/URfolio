"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { saveSiteContent } from "@/lib/content/actions";
import type { SiteContent } from "@/content/site";
import { Field, ImagePicker, ListEditor, NumberField, StringListEditor, TextArea, Toggle } from "./fields";

const TABS = [
  { id: "header", label: "Header & Footer" },
  { id: "hero", label: "Hero" },
  { id: "marquee", label: "Marquee & Statement" },
  { id: "audiences", label: "Audiences" },
  { id: "process", label: "Process" },
  { id: "work", label: "Work" },
  { id: "beforeAfter", label: "Before / After" },
  { id: "proof", label: "Proof" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
  { id: "contactForm", label: "Contact form" },
  { id: "seo", label: "SEO" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function Editor({ initialContent, writable, storageNotice }: { initialContent: SiteContent; writable: boolean; storageNotice: string }) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [tab, setTab] = useState<TabId>("header");
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  /** Every edit funnels through here so the dirty flag stays accurate. */
  const patch = useCallback((update: Partial<SiteContent>) => {
    setContent((current) => ({ ...current, ...update }));
    setDirty(true);
    setMessage(null);
  }, []);

  // Warn before losing unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function save() {
    startTransition(async () => {
      const result = await saveSiteContent(content);
      setMessage({ ok: result.ok, text: result.message });
      if (result.ok) setDirty(false);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {!writable && (
        <p role="status" className="rounded-[var(--radius-sm)] border border-mauve/40 bg-mauve/10 p-4 text-sm leading-relaxed text-fg">
          {storageNotice}
        </p>
      )}

      <div role="tablist" aria-label="Content sections" className="flex flex-wrap gap-2 border-b border-[var(--line)] pb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              tab === t.id ? "border-caramel bg-caramel text-espresso" : "border-[var(--line)] text-fg-muted hover:border-caramel hover:text-caramel"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 pb-28">
        {tab === "header" && <HeaderTab content={content} patch={patch} />}
        {tab === "hero" && <HeroTab content={content} patch={patch} />}
        {tab === "marquee" && <MarqueeTab content={content} patch={patch} />}
        {tab === "audiences" && <AudiencesTab content={content} patch={patch} />}
        {tab === "process" && <ProcessTab content={content} patch={patch} />}
        {tab === "work" && <WorkTab content={content} patch={patch} />}
        {tab === "beforeAfter" && <BeforeAfterTab content={content} patch={patch} />}
        {tab === "proof" && <ProofTab content={content} patch={patch} />}
        {tab === "pricing" && <PricingTab content={content} patch={patch} />}
        {tab === "faq" && <FaqTab content={content} patch={patch} />}
        {tab === "contactForm" && <ContactFormTab content={content} patch={patch} />}
        {tab === "seo" && <SeoTab content={content} patch={patch} />}
      </div>

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-espresso/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="text-sm">
            {message ? (
              <span role="status" className={message.ok ? "text-caramel" : "text-mauve"}>
                {message.text}
              </span>
            ) : dirty ? (
              <span className="text-caramel">Unsaved changes</span>
            ) : (
              <span className="text-fg-muted">No changes</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[var(--line)] px-5 py-2.5 text-sm text-fg hover:border-caramel hover:text-caramel">
              Preview site
            </a>
            <button
              type="button"
              onClick={save}
              disabled={pending || !dirty}
              className="rounded-full bg-caramel px-6 py-2.5 text-sm font-medium text-espresso transition-colors hover:bg-clay disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionIntro({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-h3 text-fg">{title}</h2>
      <p className="text-fg-muted mt-1 text-sm">{description}</p>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-raised)] p-5">{children}</div>;
}

type TabProps = { content: SiteContent; patch: (update: Partial<SiteContent>) => void };

// ─── Header & Footer ──────────────────────────────────────────────────

function HeaderTab({ content, patch }: TabProps) {
  const { nav, footer, contact, branding } = content;
  const setNav = (u: Partial<SiteContent["nav"]>) => patch({ nav: { ...nav, ...u } });
  const setFooter = (u: Partial<SiteContent["footer"]>) => patch({ footer: { ...footer, ...u } });
  const setContact = (u: Partial<SiteContent["contact"]>) => patch({ contact: { ...contact, ...u } });

  return (
    <div className="flex flex-col gap-6">
      <SectionIntro title="Branding" description="The logo shown in the header, mobile menu and loading screen." />
      <Card>
        <ImagePicker label="Logo image" value={branding.logoImage} onChange={(logoImage) => patch({ branding: { logoImage } })} hint="Leave empty to use the built-in URfolio mark." />
      </Card>

      <SectionIntro title="Navigation" description="The links in the header, in order, and the button on the right." />
      <Card>
        <Field label="Button label" value={nav.cta} onChange={(cta) => setNav({ cta })} />
      </Card>
      <ListEditor
        items={nav.links}
        onChange={(links) => setNav({ links })}
        addLabel="Add a link"
        makeNew={() => ({ label: "", href: "#" })}
        summary={(l) => l.label}
        renderItem={(link, update) => (
          <>
            <Field label="Label" value={link.label} onChange={(label) => update({ label })} />
            <Field label="Link (e.g. #work, or a full URL)" value={link.href} onChange={(href) => update({ href })} />
          </>
        )}
      />

      <SectionIntro title="Footer" description="The giant wordmark, tagline and back-to-top button." />
      <Card>
        <Field label="Wordmark" value={footer.wordmark} onChange={(wordmark) => setFooter({ wordmark })} />
        <Field label="Tagline" value={footer.tagline} onChange={(tagline) => setFooter({ tagline })} />
        <Field label="Back to top button" value={footer.backToTop} onChange={(backToTop) => setFooter({ backToTop })} />
      </Card>

      <SectionIntro title="Contact details" description="Shown in the footer and used to build the WhatsApp/email links across the site." />
      <Card>
        <Field label="Email" type="email" value={contact.email} onChange={(email) => setContact({ email })} />
        <Field label="WhatsApp number (international format, no + or leading 00)" value={contact.whatsapp} onChange={(whatsapp) => setContact({ whatsapp })} placeholder="971500000000" />
        <Field label="WhatsApp number as displayed" value={contact.whatsappDisplay} onChange={(whatsappDisplay) => setContact({ whatsappDisplay })} placeholder="+971 50 000 0000" />
      </Card>
      <SectionIntro title="Social links" description="Shown in the footer. Leave the link empty to show it as not-yet-available." />
      <ListEditor
        items={contact.socials}
        onChange={(socials) => setContact({ socials })}
        addLabel="Add a social link"
        makeNew={() => ({ id: newId("social"), label: "", href: "" })}
        summary={(s) => s.label}
        renderItem={(social, update) => (
          <>
            <Field label="Label" value={social.label} onChange={(label) => update({ label })} />
            <Field label="URL" value={social.href} onChange={(href) => update({ href })} placeholder="https://instagram.com/…" />
          </>
        )}
      />
    </div>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────

function HeroTab({ content, patch }: TabProps) {
  const { hero } = content;
  const set = (u: Partial<SiteContent["hero"]>) => patch({ hero: { ...hero, ...u } });

  return (
    <div className="flex flex-col gap-6">
      <SectionIntro title="Hero" description="The first thing visitors see." />
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label='"Individual" toggle label' value={hero.toggle.individual} onChange={(individual) => set({ toggle: { ...hero.toggle, individual } })} />
          <Field label='"Company" toggle label' value={hero.toggle.company} onChange={(company) => set({ toggle: { ...hero.toggle, company } })} />
        </div>
        <StringListEditor label="Headline (one line each)" items={hero.headline} onChange={(headline) => set({ headline })} addLabel="Add a line" />
        <TextArea label="Sub-copy — Individual" value={hero.sub.individual} onChange={(individual) => set({ sub: { ...hero.sub, individual } })} hint='Use "[X]" for a number you want to fill in later, e.g. "live in [X] days".' />
        <TextArea label="Sub-copy — Company" value={hero.sub.company} onChange={(company) => set({ sub: { ...hero.sub, company } })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Primary button" value={hero.ctaPrimary} onChange={(ctaPrimary) => set({ ctaPrimary })} />
          <Field label="Secondary button" value={hero.ctaSecondary} onChange={(ctaSecondary) => set({ ctaSecondary })} />
        </div>
        <Field label='"Type your name" prompt' value={hero.namePrompt} onChange={(namePrompt) => set({ namePrompt })} />
        <StringListEditor label="Trust chips" items={hero.trustChips} onChange={(trustChips) => set({ trustChips })} addLabel="Add a chip" />
      </Card>

      <SectionIntro
        title="Live preview samples"
        description={'The sample name/role/domain shown in the hero\'s live build preview. "Individual" is also reused by the Before/After section.'}
      />
      <Card>
        <h3 className="text-caramel text-sm font-semibold">Individual sample</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Name" value={hero.preview.individual.name} onChange={(name) => set({ preview: { ...hero.preview, individual: { ...hero.preview.individual, name } } })} />
          <Field label="Role" value={hero.preview.individual.role} onChange={(role) => set({ preview: { ...hero.preview, individual: { ...hero.preview.individual, role } } })} />
          <Field label="Domain" value={hero.preview.individual.domain} onChange={(domain) => set({ preview: { ...hero.preview, individual: { ...hero.preview.individual, domain } } })} />
        </div>
        <h3 className="text-caramel text-sm font-semibold">Company sample</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Name" value={hero.preview.company.name} onChange={(name) => set({ preview: { ...hero.preview, company: { ...hero.preview.company, name } } })} />
          <Field label="Role" value={hero.preview.company.role} onChange={(role) => set({ preview: { ...hero.preview, company: { ...hero.preview.company, role } } })} />
          <Field label="Domain" value={hero.preview.company.domain} onChange={(domain) => set({ preview: { ...hero.preview, company: { ...hero.preview.company, domain } } })} />
        </div>
        <StringListEditor label="Preview status messages (in order)" items={hero.previewStatus} onChange={(previewStatus) => set({ previewStatus })} addLabel="Add a status" />
      </Card>
    </div>
  );
}

// ─── Marquee & Statement ───────────────────────────────────────────────

function MarqueeTab({ content, patch }: TabProps) {
  const { marquee, statement } = content;
  return (
    <div className="flex flex-col gap-6">
      <SectionIntro title="Marquee" description="The scrolling word strip." />
      <Card>
        <StringListEditor label="Words" items={marquee.words} onChange={(words) => patch({ marquee: { words } })} addLabel="Add a word" />
      </Card>
      <SectionIntro title="Statement" description="The large scroll-fill paragraph." />
      <Card>
        <TextArea label="Text" value={statement.text} onChange={(text) => patch({ statement: { text } })} rows={4} />
      </Card>
    </div>
  );
}

// ─── Audiences ─────────────────────────────────────────────────────────

function AudiencesTab({ content, patch }: TabProps) {
  const { audiences } = content;
  const [individual, company] = audiences.panels;
  const setPanel = (index: 0 | 1, u: Partial<SiteContent["audiences"]["panels"][number]>) => {
    const panels = [...audiences.panels] as SiteContent["audiences"]["panels"];
    panels[index] = { ...panels[index], ...u };
    patch({ audiences: { ...audiences, panels } });
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionIntro title="Audiences" description='The "Built for two kinds of client" split section.' />
      <Card>
        <Field label="Section heading" value={audiences.heading} onChange={(heading) => patch({ audiences: { ...audiences, heading } })} />
      </Card>

      <h3 className="text-caramel text-sm font-semibold">For individuals</h3>
      <Card>
        <Field label="Eyebrow" value={individual.eyebrow} onChange={(eyebrow) => setPanel(0, { eyebrow })} />
        <StringListEditor label="Heading (one line each)" items={individual.heading} onChange={(heading) => setPanel(0, { heading })} addLabel="Add a line" />
        <StringListEditor label="Points" items={individual.points} onChange={(points) => setPanel(0, { points })} addLabel="Add a point" />
        <Field label="Button" value={individual.cta} onChange={(cta) => setPanel(0, { cta })} />
      </Card>

      <h3 className="text-caramel text-sm font-semibold">For companies</h3>
      <Card>
        <Field label="Eyebrow" value={company.eyebrow} onChange={(eyebrow) => setPanel(1, { eyebrow })} />
        <StringListEditor label="Heading (one line each)" items={company.heading} onChange={(heading) => setPanel(1, { heading })} addLabel="Add a line" />
        <StringListEditor label="Points" items={company.points} onChange={(points) => setPanel(1, { points })} addLabel="Add a point" />
        <Field label="Button" value={company.cta} onChange={(cta) => setPanel(1, { cta })} />
      </Card>
    </div>
  );
}

// ─── Process ───────────────────────────────────────────────────────────

function ProcessTab({ content, patch }: TabProps) {
  const { process } = content;
  return (
    <div className="flex flex-col gap-4">
      <SectionIntro title="Process" description='The "How it works" pinned steps.' />
      <Card>
        <Field label="Section heading" value={process.heading} onChange={(heading) => patch({ process: { ...process, heading } })} />
      </Card>
      <ListEditor
        items={process.steps}
        onChange={(steps) => patch({ process: { ...process, steps } })}
        addLabel="Add a step"
        makeNew={() => ({ number: String(process.steps.length + 1).padStart(2, "0"), title: "", description: "" })}
        summary={(s) => `${s.number} — ${s.title}`}
        renderItem={(step, update) => (
          <>
            <div className="grid gap-4 sm:grid-cols-[100px_1fr]">
              <Field label="Number" value={step.number} onChange={(number) => update({ number })} />
              <Field label="Title" value={step.title} onChange={(title) => update({ title })} />
            </div>
            <TextArea label="Description" value={step.description} onChange={(description) => update({ description })} />
          </>
        )}
      />
    </div>
  );
}

// ─── Work ──────────────────────────────────────────────────────────────

function WorkTab({ content, patch }: TabProps) {
  const { work } = content;
  return (
    <div className="flex flex-col gap-4">
      <SectionIntro title="Work" description="Add, edit, delete, duplicate, reorder, and show/hide projects. The number shown on the site always matches a project's position among visible ones." />
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Section heading" value={work.heading} onChange={(heading) => patch({ work: { ...work, heading } })} />
          <Field label="Count label" value={work.count} onChange={(count) => patch({ work: { ...work, count } })} />
        </div>
      </Card>
      <ListEditor
        items={work.items}
        onChange={(items) => patch({ work: { ...work, items } })}
        addLabel="Add a project"
        hiddenKey="hidden"
        makeNew={() => ({ id: newId("project"), title: "", type: "Personal", year: "", seed: Math.ceil(Math.random() * 999), result: "", link: null })}
        summary={(w) => w.title}
        renderItem={(item, update) => (
          <>
            <Field label="Title" value={item.title} onChange={(title) => update({ title })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category (e.g. Personal, Company)" value={item.type} onChange={(type) => update({ type })} />
              <Field label="Year" value={item.year} onChange={(year) => update({ year })} />
            </div>
            <TextArea label="One-line result" value={item.result} onChange={(result) => update({ result })} />
            <Field label="Live link (optional)" value={item.link ?? ""} onChange={(link) => update({ link: link || null })} placeholder="https://…" />
            <Toggle label="Hidden from the public site" checked={Boolean(item.hidden)} onChange={(hidden) => update({ hidden })} />
          </>
        )}
      />
    </div>
  );
}

// ─── Before / After ─────────────────────────────────────────────────────

function BeforeAfterTab({ content, patch }: TabProps) {
  const { beforeAfter, hero } = content;
  return (
    <div className="flex flex-col gap-6">
      <SectionIntro
        title="Before / After"
        description={'The persona shown here is the same as the Hero tab\'s "Individual sample" — edit it there to keep both in sync.'}
      />
      <Card>
        <Field label="Section heading (screen-reader only)" value={beforeAfter.heading} onChange={(heading) => patch({ beforeAfter: { ...beforeAfter, heading } })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label='"Without" toggle label' value={beforeAfter.toggle.without} onChange={(without) => patch({ beforeAfter: { ...beforeAfter, toggle: { ...beforeAfter.toggle, without } } })} />
          <Field label='"With" toggle label' value={beforeAfter.toggle.with} onChange={(w) => patch({ beforeAfter: { ...beforeAfter, toggle: { ...beforeAfter.toggle, with: w } } })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label='"Without" caption' value={beforeAfter.caption.without} onChange={(without) => patch({ beforeAfter: { ...beforeAfter, caption: { ...beforeAfter.caption, without } } })} />
          <Field label='"With" caption' value={beforeAfter.caption.with} onChange={(w) => patch({ beforeAfter: { ...beforeAfter, caption: { ...beforeAfter.caption, with: w } } })} />
        </div>
      </Card>
      <p className="text-fg-muted text-sm">
        Persona shown: <strong className="text-fg">{hero.preview.individual.name}</strong>, {hero.preview.individual.role} — edit on the Hero tab.
      </p>
    </div>
  );
}

// ─── Proof ─────────────────────────────────────────────────────────────

function ProofTab({ content, patch }: TabProps) {
  const { proof } = content;
  return (
    <div className="flex flex-col gap-4">
      <SectionIntro title="Stats" description='Use "[X]" as the value to show a placeholder instead of a number.' />
      <ListEditor
        items={proof.metrics}
        onChange={(metrics) => patch({ proof: { ...proof, metrics } })}
        addLabel="Add a stat"
        makeNew={() => ({ value: "[X]" as const, suffix: "", label: "" })}
        summary={(m) => `${m.value}${m.suffix} — ${m.label}`}
        renderItem={(metric, update) => (
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField label="Value" value={metric.value} onChange={(value) => update({ value })} placeholderText="[X]" />
            <Field label='Suffix (e.g. "+", "/5")' value={metric.suffix} onChange={(suffix) => update({ suffix })} />
            <Field label="Label" value={metric.label} onChange={(label) => update({ label })} />
          </div>
        )}
      />
      <SectionIntro title="Testimonials" description="Shown as a 3D card stack." />
      <ListEditor
        items={proof.testimonials}
        onChange={(testimonials) => patch({ proof: { ...proof, testimonials } })}
        addLabel="Add a testimonial"
        makeNew={() => ({ id: newId("quote"), quote: "", name: "", role: "" })}
        summary={(t) => t.name}
        renderItem={(item, update) => (
          <>
            <TextArea label="Quote" value={item.quote} onChange={(quote) => update({ quote })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" value={item.name} onChange={(name) => update({ name })} />
              <Field label="Role" value={item.role} onChange={(role) => update({ role })} />
            </div>
          </>
        )}
      />
    </div>
  );
}

// ─── Pricing ───────────────────────────────────────────────────────────

function PricingTab({ content, patch }: TabProps) {
  const { pricing } = content;
  return (
    <div className="flex flex-col gap-4">
      <SectionIntro title="Pricing" description="The three plan cards. The featured plan is visually emphasised." />
      <Card>
        <Field label="Section heading" value={pricing.heading} onChange={(heading) => patch({ pricing: { ...pricing, heading } })} />
        <Field label="Note below the cards" value={pricing.note} onChange={(note) => patch({ pricing: { ...pricing, note } })} />
      </Card>
      <ListEditor
        items={pricing.plans}
        onChange={(plans) => patch({ pricing: { ...pricing, plans } })}
        addLabel="Add a plan"
        makeNew={() => ({ id: newId("plan"), name: "", price: "[ ]" as const, currency: "AED", featured: false, features: [], cta: "Choose plan" })}
        summary={(p) => p.name}
        renderItem={(plan, update) => (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Name" value={plan.name} onChange={(name) => update({ name })} />
              <NumberField label="Price" value={plan.price} onChange={(price) => update({ price })} placeholderText="[ ]" />
              <Field label="Currency" value={plan.currency} onChange={(currency) => update({ currency })} />
            </div>
            <Toggle label="Featured (visually emphasised)" checked={plan.featured} onChange={(featured) => update({ featured })} />
            <StringListEditor label="Features" items={plan.features} onChange={(features) => update({ features })} addLabel="Add a feature" />
            <Field label="Button" value={plan.cta} onChange={(cta) => update({ cta })} />
          </>
        )}
      />
    </div>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────

function FaqTab({ content, patch }: TabProps) {
  const { faq } = content;
  return (
    <div className="flex flex-col gap-4">
      <SectionIntro title="FAQ" description="One open at a time on the site." />
      <Card>
        <Field label="Section heading" value={faq.heading} onChange={(heading) => patch({ faq: { ...faq, heading } })} />
      </Card>
      <ListEditor
        items={faq.items}
        onChange={(items) => patch({ faq: { ...faq, items } })}
        addLabel="Add a question"
        makeNew={() => ({ id: newId("faq"), question: "", answer: "" })}
        summary={(i) => i.question}
        renderItem={(item, update) => (
          <>
            <Field label="Question" value={item.question} onChange={(question) => update({ question })} />
            <TextArea label="Answer" value={item.answer} onChange={(answer) => update({ answer })} />
          </>
        )}
      />
    </div>
  );
}

// ─── Contact form ────────────────────────────────────────────────────────

function ContactFormTab({ content, patch }: TabProps) {
  const { contactForm } = content;
  const set = (u: Partial<SiteContent["contactForm"]>) => patch({ contactForm: { ...contactForm, ...u } });

  return (
    <div className="flex flex-col gap-6">
      <SectionIntro title="Contact form" description={'The "Let\'s build yours" brief form.'} />
      <Card>
        <Field label="Heading" value={contactForm.heading} onChange={(heading) => set({ heading })} />
        <Field label="Sub-heading" value={contactForm.sub} onChange={(sub) => set({ sub })} />
      </Card>

      <h3 className="text-caramel text-sm font-semibold">&quot;I am&quot; chips</h3>
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Individual label" value={contactForm.iAm.options[0].label} onChange={(label) => set({ iAm: { ...contactForm.iAm, options: [{ ...contactForm.iAm.options[0], label }, contactForm.iAm.options[1]] } })} />
          <Field label="Company label" value={contactForm.iAm.options[1].label} onChange={(label) => set({ iAm: { ...contactForm.iAm, options: [contactForm.iAm.options[0], { ...contactForm.iAm.options[1], label }] } })} />
        </div>
      </Card>

      <h3 className="text-caramel text-sm font-semibold">&quot;I need&quot; chips</h3>
      <ListEditor
        items={contactForm.need.options}
        onChange={(options) => set({ need: { ...contactForm.need, options } })}
        addLabel="Add an option"
        makeNew={() => ({ value: newId("need"), label: "" })}
        summary={(o) => o.label}
        renderItem={(opt, update) => <Field label="Label" value={opt.label} onChange={(label) => update({ label })} />}
      />

      <h3 className="text-caramel text-sm font-semibold">&quot;Plan&quot; chips</h3>
      <p className="text-fg-muted text-xs">Tip: keep a chip&apos;s value matching a pricing plan&apos;s id so choosing that plan pre-selects the right chip here.</p>
      <ListEditor
        items={contactForm.plan.options}
        onChange={(options) => set({ plan: { ...contactForm.plan, options } })}
        addLabel="Add an option"
        makeNew={() => ({ value: newId("plan"), label: "" })}
        summary={(o) => o.label}
        renderItem={(opt, update) => (
          <>
            <Field label="Label" value={opt.label} onChange={(label) => update({ label })} />
            <Field label="Value (matches a pricing plan id)" value={opt.value} onChange={(value) => update({ value })} />
          </>
        )}
      />

      <h3 className="text-caramel text-sm font-semibold">&quot;Budget&quot; chips</h3>
      <ListEditor
        items={contactForm.budget.options}
        onChange={(options) => set({ budget: { ...contactForm.budget, options } })}
        addLabel="Add an option"
        makeNew={() => ({ value: newId("budget"), label: "" })}
        summary={(o) => o.label}
        renderItem={(opt, update) => <Field label="Label" value={opt.label} onChange={(label) => update({ label })} />}
      />

      <h3 className="text-caramel text-sm font-semibold">Fields</h3>
      <Card>
        {(["name", "email", "whatsapp", "link", "message"] as const).map((key) => (
          <div key={key} className="grid gap-4 sm:grid-cols-2">
            <Field label={`${key} — label`} value={contactForm.fields[key].label} onChange={(label) => set({ fields: { ...contactForm.fields, [key]: { ...contactForm.fields[key], label } } })} />
            <Field label={`${key} — placeholder`} value={contactForm.fields[key].placeholder} onChange={(placeholder) => set({ fields: { ...contactForm.fields, [key]: { ...contactForm.fields[key], placeholder } } })} />
          </div>
        ))}
      </Card>

      <h3 className="text-caramel text-sm font-semibold">Messages</h3>
      <Card>
        <Field label="Submit button" value={contactForm.submit} onChange={(submit) => set({ submit })} />
        <Field label="Success message" value={contactForm.success} onChange={(success) => set({ success })} />
        <Field label="Name error" value={contactForm.errors.name} onChange={(name) => set({ errors: { ...contactForm.errors, name } })} />
        <Field label="Email error" value={contactForm.errors.email} onChange={(email) => set({ errors: { ...contactForm.errors, email } })} />
        <Field label="Required-choice error" value={contactForm.errors.required} onChange={(required) => set({ errors: { ...contactForm.errors, required } })} />
        <Field label="WhatsApp prompt" value={contactForm.whatsappPrompt} onChange={(whatsappPrompt) => set({ whatsappPrompt })} />
      </Card>
    </div>
  );
}

// ─── SEO ───────────────────────────────────────────────────────────────

function SeoTab({ content, patch }: TabProps) {
  const { meta } = content;
  return (
    <div className="flex flex-col gap-4">
      <SectionIntro title="SEO" description="Shown in the browser tab and search results." />
      <Card>
        <Field label="Site title" value={meta.title} onChange={(title) => patch({ meta: { ...meta, title } })} />
        <TextArea label="Site description" value={meta.description} onChange={(description) => patch({ meta: { ...meta, description } })} />
      </Card>
    </div>
  );
}
