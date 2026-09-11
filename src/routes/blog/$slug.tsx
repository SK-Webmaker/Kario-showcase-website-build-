import { createFileRoute, notFound } from "@tanstack/react-router";

import { AuthorBio } from "@/components/seo/AuthorBio";
import { CtaBanner } from "@/components/seo/CtaBanner";
import { PageShell } from "@/components/seo/PageShell";
import { MaskLines, Reveal } from "@/components/v2/motion";
import { Plate } from "@/components/v2/cinematic";
import { fetchPost, parseMarkdown } from "@/lib/blog";
import { articleSchema, breadcrumbSchema, organizationSchema, seo } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { post, author } = await fetchPost(params.slug);
    if (!post) throw notFound();
    return { post, author };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return seo({
        title: "Article not found | Kairo Bookings",
        description: "This article is not available.",
        path: `/blog/${params.slug}`,
        noindex: true,
      });
    }
    const { post, author } = loaderData;
    const description = post.summary ?? "An article from the Kairo Bookings blog.";
    return seo({
      title: `${post.title} | Kairo Bookings`.slice(0, 60),
      description,
      path: `/blog/${post.slug}`,
      ...(post.cover_image_url ? { ogImage: post.cover_image_url } : {}),
      schema: [
        organizationSchema(),
        articleSchema({
          headline: post.title,
          description,
          path: `/blog/${post.slug}`,
          ...(post.published_at ? { datePublished: post.published_at } : {}),
          dateModified: post.updated_at,
          ...(author?.name ? { authorName: author.name } : {}),
          ...(post.cover_image_url ? { image: post.cover_image_url } : {}),
        }),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]),
      ],
    });
  },
  notFoundComponent: NotFound,
  component: Page,
});

function NotFound() {
  return (
    <PageShell
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
      ]}
    >
      <section
        className="mx-auto"
        style={{ padding: "calc(6 * var(--u)) var(--pad)", maxWidth: "calc(100 * var(--u))" }}
      >
        <h1 className="v2-display v2-t1">
          <MaskLines play="now" lines={["That article", "isn't here"]} />
        </h1>
        <Reveal
          play="now"
          delay={400}
          opacity={0.75}
          className="v2-body max-w-[48ch]"
          style={{ marginTop: "calc(1.6 * var(--u))" }}
        >
          It may have moved, or it may not be published yet.
        </Reveal>
        <Reveal play="now" delay={560} style={{ marginTop: "calc(2.4 * var(--u))" }}>
          <a href="/blog" className="v2-btn">
            Back to the blog
          </a>
        </Reveal>
      </section>
    </PageShell>
  );
}

function Page() {
  const { post, author } = Route.useLoaderData();
  const blocks = parseMarkdown(post.body);

  return (
    <PageShell
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: `/blog/${post.slug}` },
      ]}
    >
      <article
        className="mx-auto"
        style={{
          padding: "calc(2.4 * var(--u)) var(--pad) calc(4 * var(--u))",
          maxWidth: "calc(100 * var(--u))",
        }}
      >
        <h1 className="v2-display v2-t1" style={{ maxWidth: "22ch" }}>
          <MaskLines play="now" delay={100} lines={[post.title]} />
        </h1>
        {post.summary ? (
          <Reveal
            play="now"
            delay={420}
            opacity={0.75}
            className="v2-body max-w-[62ch]"
            style={{ marginTop: "calc(1.6 * var(--u))" }}
          >
            {post.summary}
          </Reveal>
        ) : null}

        {post.cover_image_url ? (
          <Plate
            src={post.cover_image_url}
            alt={post.title}
            eager
            depth={14}
            style={{ marginTop: "calc(3 * var(--u))" }}
          />
        ) : null}

        {/* The body reveals block by block: a long article that arrives
            all at once has no pace to it. */}
        <div className="space-y-5" style={{ marginTop: "calc(3 * var(--u))" }}>
          {blocks.map((b, i) => {
            if (b.kind === "ul") {
              return (
                <Reveal as="ul" key={i} opacity={0.7} className="v2-body max-w-[68ch] space-y-2">
                  {b.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.62em] h-[0.32em] w-[0.32em] shrink-0 rounded-full"
                        style={{ background: "var(--v2-a)" }}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </Reveal>
              );
            }
            if (b.kind === "h2") {
              return (
                <h2
                  key={i}
                  className="v2-display v2-t2"
                  style={{ maxWidth: "30ch", paddingTop: "calc(1.6 * var(--u))" }}
                >
                  <MaskLines lines={[b.text]} />
                </h2>
              );
            }
            if (b.kind === "h3") {
              return (
                <Reveal
                  as="p"
                  key={i}
                  className="v2-display v2-t4 max-w-[34ch]"
                  style={{ paddingTop: "calc(0.8 * var(--u))" }}
                >
                  {b.text}
                </Reveal>
              );
            }
            return (
              <Reveal as="p" key={i} opacity={0.7} className="v2-body max-w-[68ch]">
                {b.text}
              </Reveal>
            );
          })}
        </div>
      </article>

      <AuthorBio author={author} published={post.published_at} updated={post.updated_at} />

      <CtaBanner />
    </PageShell>
  );
}
