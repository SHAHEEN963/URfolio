"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import { contactForm, contact, type Audience } from "@/content/site";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { useSiteState } from "@/lib/site-state";
import { whatsappHref } from "@/lib/contact-links";
import { submitBrief } from "@/lib/submit-brief";
import { gsapEase } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

type FieldErrors = { name?: string; email?: string; iAm?: string; need?: string; plan?: string; budget?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Contact() {
  const { audience, setAudience, planId } = useSiteState();
  const [need, setNeed] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  const successRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Arriving from a Pricing "Choose X" click pre-selects that plan. This is
  // real, independently-editable form state — only its *initial* value
  // comes from that external trigger, so it isn't the "derived state"
  // pattern the set-state-in-effect rule is meant to catch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (planId) setPlan(planId);
  }, [planId]);

  useEffect(() => {
    if (status !== "success") return;
    const el = successRef.current;
    if (!el || reduced) return;
    gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: gsapEase.enter });
  }, [status, reduced]);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = contactForm.errors.name;
    if (!EMAIL_RE.test(email)) next.email = contactForm.errors.email;
    if (!need) next.need = contactForm.errors.required;
    if (!plan) next.plan = contactForm.errors.required;
    if (!budget) next.budget = contactForm.errors.required;
    return next;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("submitting");
    const result = await submitBrief({
      audience,
      need: need!,
      plan: plan!,
      budget: budget!,
      name,
      email,
      whatsapp,
      link,
      message,
    });
    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setSubmitError(result.error);
    }
  };

  const wa = whatsappHref(contact, "Hi! I'd like to build a portfolio with URfolio.");

  return (
    <section id="contact" className="section" aria-label="Contact">
      <div className="container max-w-2xl">
        <h2 className="text-h2 text-fg">{contactForm.heading}</h2>
        <p className="text-lead mt-3 text-fg-muted">{contactForm.sub}</p>

        {status === "success" ? (
          <div ref={successRef} className="mt-10 rounded-[var(--radius-sm)] border border-caramel bg-[var(--bg-raised)] p-8" aria-live="polite">
            <p className="text-h3 text-fg">{contactForm.success}</p>
          </div>
        ) : (
          <form className="mt-10 space-y-8" onSubmit={onSubmit} noValidate>
            <ChipField
              label={contactForm.iAm.label}
              options={contactForm.iAm.options}
              value={audience}
              onChange={(v) => setAudience(v as Audience)}
            />
            <ChipField
              label={contactForm.need.label}
              options={contactForm.need.options}
              value={need}
              onChange={setNeed}
              error={errors.need}
            />
            <ChipField
              label={contactForm.plan.label}
              options={contactForm.plan.options}
              value={plan}
              onChange={setPlan}
              error={errors.plan}
            />
            <ChipField
              label={contactForm.budget.label}
              options={contactForm.budget.options}
              value={budget}
              onChange={setBudget}
              error={errors.budget}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                label={contactForm.fields.name.label}
                value={name}
                onChange={setName}
                placeholder={contactForm.fields.name.placeholder}
                error={errors.name}
                required
              />
              <TextField
                label={contactForm.fields.email.label}
                type="email"
                value={email}
                onChange={setEmail}
                placeholder={contactForm.fields.email.placeholder}
                error={errors.email}
                required
              />
              <TextField
                label={contactForm.fields.whatsapp.label}
                value={whatsapp}
                onChange={setWhatsapp}
                placeholder={contactForm.fields.whatsapp.placeholder}
              />
              <TextField
                label={contactForm.fields.link.label}
                value={link}
                onChange={setLink}
                placeholder={contactForm.fields.link.placeholder}
              />
            </div>
            <TextField
              label={contactForm.fields.message.label}
              value={message}
              onChange={setMessage}
              placeholder={contactForm.fields.message.placeholder}
              multiline
            />

            {status === "error" && (
              <p role="alert" className="text-small text-mauve">
                {submitError}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6">
              <Button type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Sending…" : contactForm.submit}
              </Button>
              {wa ? (
                <a href={wa} className="text-small text-fg-muted hover:text-caramel">
                  {contactForm.whatsappPrompt}
                </a>
              ) : (
                <span className="ph-inline text-small text-fg-muted" title="Placeholder — replace before launch">
                  {contactForm.whatsappPrompt}
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function ChipField({
  label,
  options,
  value,
  onChange,
  error,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <fieldset>
      <legend className="text-small text-fg-muted mb-3">{label}</legend>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <Chip key={opt.value} label={opt.label} selected={value === opt.value} onClick={() => onChange(opt.value)} />
        ))}
      </div>
      {error && (
        <p role="alert" className="text-small text-mauve mt-2">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  required,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  const id = `field-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const inputClasses =
    "w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-transparent px-4 py-3 text-fg outline-none focus-visible:border-caramel";
  return (
    <div>
      <label htmlFor={id} className="text-small text-fg-muted mb-2 block">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-invalid={!!error}
          className={inputClasses}
        />
      )}
      {error && (
        <p role="alert" className="text-small text-mauve mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
