import { createFileRoute } from "@tanstack/react-router";

import { CtaBanner } from "@/components/seo/CtaBanner";
import { PageHero } from "@/components/seo/Hero";
import { PageShell, Todo } from "@/components/seo/PageShell";
import { Reveal } from "@/components/v2/motion";
import { formatVerified } from "@/components/seo/PricingVerificationNotice";
import { fetchPublishedPosts } from "@/lib/blog";
import { breadcrumbSchema, organizationSchema, seo } from "@/lib/seo";

const PATH = "/blog";
const TITLE = "Salon Software Advice & Pricing | Kairo Blog";
const DESCRIPTION =
  "Plain-English writing on salon booking software, commission and subscription costs, switching systems and running an appointment business in Australia.";

export const Route = createFileRoute("/blog/")({
  loader: async () => ({ posts: await fetchPublishedPosts() }),
  head: () =>
    seo({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      schema: [
        organizationSchema(),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: PATH },
        ]),
      ],
    }),
  component: Page,
});

function Page() {
  const { posts } = Route.useLoaderData();

  return (
    <PageShell
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Blog", path: PATH },
      ]}
    >
      <PageHero
        kicker="Blog"
        headline="Writing about the business behind the chair"
        subhead="What salon software actually costs, how commission adds up, and how to move systems without losing a client."
      />

      <section
        className="mx-auto border-t border-white/10"
        style={{ padding: "calc(4 * var(--u)) var(--pad)", maxWidth: "calc(100 * var(--u))" }}
      >
        {posts.length === 0 ? (
          <Todo>no posts published yet. Write and publish the first article.</Todo>
        ) : (
          <ul
            className="grid sm:grid-cols-2"
            style={{ gap: "1px", background: "rgb(255 255 255 / 0.1)" }}
          >
            {posts.map((p, i) => (
              <Reveal
                as="li"
                key={p.id}
                delay={(i % 2) * 90}
                style={{ background: "var(--v2-ground)" }}
              >
                <a
                  href={`/blog/${p.slug}`}
                  className="group/post block h-full transition-colors duration-500 hover:bg-white/[0.04]"
                  style={{ padding: "calc(2 * var(--u))" }}
                >
                  {p.published_at ? (
                    <p className="v2-eyebrow opacity-40">{formatVerified(p.published_at)}</p>
                  ) : null}
                  <h2
                    className="v2-display v2-t3 transition-transform duration-500 group-hover/post:translate-x-1"
                    style={{ marginTop: "calc(0.7 * var(--u))" }}
                  >
                    {p.title}
                  </h2>
                  {p.summary ? <p className="v2-body mt-3 opacity-60">{p.summary}</p> : null}
                </a>
              </Reveal>
            ))}
          </ul>
        )}
      </section>

      <CtaBanner />
    </PageShell>
  );
}
