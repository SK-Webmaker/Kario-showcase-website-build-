export type Crumb = { name: string; path: string };

export function Breadcrumbs({ crumbs }: { crumbs: readonly Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="v2-eyebrow flex flex-wrap items-center gap-x-2 gap-y-1 opacity-50">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page">{c.name}</span>
              ) : (
                <a href={c.path} className="v2-tap transition-opacity hover:opacity-100">
                  {c.name}
                </a>
              )}
              {last ? null : <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
