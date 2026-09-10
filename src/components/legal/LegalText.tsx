import type { ReactNode } from "react";

import type { Block } from "@/data/legal";
import { headingId } from "@/data/legal";

/**
 * A deliberately tiny inline syntax: **bold**, *italic*, [label](/href).
 * The policy text is authored in this repo, so there is nothing to
 * sanitise and no reason to reach for dangerouslySetInnerHTML.
 */
const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)]+)\)$/;

export function Inline({ text }: { text: string }): ReactNode {
  return (
    <>
      {text.split(INLINE).map((part, i) => {
        if (!part) return null;
        const key = `${i}:${part.slice(0, 16)}`;

        if (part.length > 4 && part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={key} className="font-semibold text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }

        if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
          return <em key={key}>{part.slice(1, -1)}</em>;
        }

        const link = LINK.exec(part);
        if (link) {
          const label = link[1] ?? "";
          const href = link[2] ?? "";
          const external = !href.startsWith("/");
          return (
            <a
              key={key}
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="v2-tap-y text-brand underline decoration-brand/35 underline-offset-[3px]
                         transition-colors duration-[660ms] ease-66 hover:decoration-brand"
            >
              {label}
            </a>
          );
        }

        return <span key={key}>{part}</span>;
      })}
    </>
  );
}

export function Blocks({ blocks }: { blocks: readonly Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "h":
            return (
              <h2
                key={`h${i}`}
                id={headingId(b.text)}
                className="mt-12 scroll-mt-24 font-sans text-[17px] font-bold
                           tracking-[-0.01em] text-ink first:mt-0"
              >
                {b.text}
              </h2>
            );

          case "p":
            return (
              <p
                key={`p${i}`}
                className="mt-3 max-w-[68ch] text-[15.5px] leading-[1.68] text-ink-2"
              >
                <Inline text={b.text} />
              </p>
            );

          case "ul":
            return (
              <ul key={`u${i}`} className="mt-4 max-w-[68ch] space-y-2.5">
                {b.items.map((item) => (
                  <li
                    key={item.slice(0, 32)}
                    className="flex gap-3 text-[15.5px] leading-[1.62] text-ink-2"
                  >
                    <span aria-hidden="true" className="mt-[10px] h-1 w-1 shrink-0 bg-brand" />
                    <span>
                      <Inline text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );

          case "note":
            return (
              <div
                key={`n${i}`}
                className="mt-6 max-w-[68ch] border border-line border-l-[3px] border-l-brand
                           bg-raised px-5 py-4 text-[14px] leading-[1.6] text-ink-2"
              >
                <Inline text={b.text} />
              </div>
            );

          case "table":
            return (
              <div key={`t${i}`} className="mt-6 max-w-[68ch] overflow-x-auto">
                <table className="w-full border-collapse text-left text-[14px]">
                  <thead>
                    <tr>
                      {b.head.map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="border-b border-line-2 pb-2 pr-5 font-mono text-[10px]
                                     font-normal uppercase tracking-[0.12em] text-ink-3"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row) => (
                      <tr key={row.join("|").slice(0, 48)}>
                        {row.map((cell, c) => (
                          <td
                            key={`${c}:${cell.slice(0, 16)}`}
                            className="border-b border-line py-3 pr-5 align-top leading-[1.5] text-ink-2"
                          >
                            <Inline text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          default:
            return null;
        }
      })}
    </>
  );
}
