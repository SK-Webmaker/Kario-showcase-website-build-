import { CtaBanner } from "./CtaBanner";
import { PageHero } from "./Hero";
import { InternalLinks } from "./InternalLinks";
import { P, PageShell, Section, Todo } from "./PageShell";
import type { Crumb } from "./Breadcrumbs";

/**
 * A route that exists, is correctly linked and carries correct metadata,
 * but is honestly marked as unwritten and kept out of the index until the
 * content is real.
 */
export function ScaffoldPage({
  crumbs,
  kicker,
  headline,
  subhead,
  todo,
  links,
}: {
  crumbs: readonly Crumb[];
  kicker: string;
  headline: string;
  subhead: string;
  todo: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <PageShell crumbs={crumbs}>
      <PageHero kicker={kicker} headline={headline} subhead={subhead} />
      <Section kicker="Status" title="This page is still being written">
        <P>
          The route, its metadata and its links are in place. The content is not, so the page is
          marked noindex until it is written.
        </P>
        <Todo>{todo}</Todo>
      </Section>
      <CtaBanner />
      <InternalLinks links={links} />
    </PageShell>
  );
}
