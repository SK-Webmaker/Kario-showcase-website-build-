import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { enquirySchema, sendEnquiry } from "@/lib/contact.functions";

type Errors = Partial<Record<"name" | "email" | "phone" | "business" | "message", string>>;

const field =
  "w-full border border-line bg-transparent px-3.5 py-3 text-[16px] text-ink placeholder:text-ink-3 " +
  "outline-none transition-colors duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "focus:border-brand focus-visible:ring-1 focus-visible:ring-brand";

const label = "chrome mb-2 block";

export function ContactForm() {
  const send = useServerFn(sendEnquiry);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFailure(null);

    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      business: String(fd.get("business") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
      company: String(fd.get("company") ?? ""),
    };

    const parsed = enquirySchema.safeParse(raw);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setState("sending");
    try {
      await send({ data: parsed.data });
      setState("sent");
    } catch (err) {
      setState("idle");
      setFailure(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please try again in a moment.",
      );
    }
  }

  if (state === "sent") {
    return (
      <div className="border border-line bg-raised p-8">
        <p className="chrome mb-3 text-brand">Message sent</p>
        <h3 className="display text-[24px] leading-tight">Thanks — we've got it.</h3>
        <p className="mt-3 max-w-[46ch] text-[14px] leading-relaxed text-ink-2">
          We read every enquiry ourselves and normally reply the same day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="border border-line bg-raised p-6 sm:p-8">
      <p className="chrome mb-6 border-b border-line pb-3">Ask us anything</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="c-name">
            Your name <span className="text-brand">*</span>
          </label>
          <input
            id="c-name"
            name="name"
            autoComplete="name"
            className={field}
            placeholder="Alex Nguyen"
          />
          {errors.name && <p className="mt-2 text-[13px] text-brand">{errors.name}</p>}
        </div>

        <div>
          <label className={label} htmlFor="c-business">
            Business <span className="normal-case tracking-normal text-ink-3">(optional)</span>
          </label>
          <input
            id="c-business"
            name="business"
            autoComplete="organization"
            className={field}
            placeholder="Luxe Hair Studio"
          />
        </div>

        <div>
          <label className={label} htmlFor="c-email">
            Email <span className="text-brand">*</span>
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={errors.email ? true : undefined}
            className={field}
            placeholder="you@yourbusiness.com"
          />
          {errors.email && <p className="mt-2 text-[13px] text-brand">{errors.email}</p>}
        </div>

        <div>
          <label className={label} htmlFor="c-phone">
            Phone <span className="normal-case tracking-normal text-ink-3">(optional)</span>
          </label>
          <input
            id="c-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={field}
            placeholder="04xx xxx xxx"
          />
          {errors.phone && <p className="mt-2 text-[13px] text-brand">{errors.phone}</p>}
        </div>
      </div>

      <div className="mt-5">
        <label className={label} htmlFor="c-message">
          What would you like to know? <span className="text-brand">*</span>
        </label>
        <textarea
          id="c-message"
          name="message"
          rows={4}
          className={field}
          placeholder="A question, or tell us about the business and we'll show you Kairo running."
        />
        {errors.message && <p className="mt-2 text-[13px] text-brand">{errors.message}</p>}
      </div>

      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px opacity-0"
      />

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-brand" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>

      {failure && (
        <p role="alert" className="mt-4 border-l-2 border-brand pl-3 text-[13.5px] text-ink-2">
          {failure}
        </p>
      )}
    </form>
  );
}
