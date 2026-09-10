import { Reveal } from "@/components/v2/motion";

import { formatVerified } from "./PricingVerificationNotice";

export type Author = {
  name: string;
  role: string | null;
  photo_url: string | null;
  bio: string | null;
};

export function AuthorBio({
  author,
  published,
  updated,
  pricingVerified,
}: {
  author: Author | null;
  published?: string | null;
  updated?: string | null;
  pricingVerified?: string | null;
}) {
  if (!author) {
    return (
      <section
        className="mx-auto border-t border-white/10"
        style={{ padding: "calc(3 * var(--u)) var(--pad)", maxWidth: "calc(100 * var(--u))" }}
      >
        <p
          className="v2-eyebrow border border-dashed px-4 py-3"
          style={{ borderColor: "rgb(185 118 13 / 0.6)", background: "rgb(185 118 13 / 0.1)" }}
        >
          TODO: named author with role, photo and bio needed before this article can publish.
        </p>
      </section>
    );
  }

  const rows = [
    ["Published", formatVerified(published)],
    ["Last updated", formatVerified(updated)],
    ["Pricing verified", formatVerified(pricingVerified)],
  ].filter(([, v]) => Boolean(v)) as [string, string][];

  return (
    <section
      className="mx-auto border-t border-white/10"
      style={{ padding: "calc(3 * var(--u)) var(--pad)", maxWidth: "calc(100 * var(--u))" }}
    >
      <Reveal
        className="flex flex-col gap-5 border border-white/10 bg-white/[0.03] sm:flex-row sm:items-start"
        style={{ borderRadius: "calc(1.2 * var(--u))", padding: "calc(2 * var(--u))" }}
      >
        {author.photo_url ? (
          <img
            src={author.photo_url}
            alt={`${author.name}, ${author.role ?? "author"}`}
            width={96}
            height={96}
            loading="lazy"
            className="h-20 w-20 shrink-0 rounded-full object-cover"
          />
        ) : null}
        <div>
          <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em]">
            {author.name}
          </p>
          {author.role ? <p className="v2-eyebrow mt-1 opacity-60">{author.role}</p> : null}
          {author.bio ? <p className="v2-body mt-3 max-w-[62ch] opacity-70">{author.bio}</p> : null}
          {rows.length > 0 ? (
            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
              {rows.map(([k, v]) => (
                <div key={k}>
                  <dt className="v2-eyebrow opacity-50">{k}</dt>
                  <dd className="v2-body opacity-70">{v}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
