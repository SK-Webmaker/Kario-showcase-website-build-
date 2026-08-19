/**
 * The structural difference, drawn.
 *
 * Top: a marketplace. A client arrives at the platform and is shown a
 * list — you are one row of five, and four of them are your competitors.
 * Bottom: your own link. One client, one arrow, one salon.
 *
 * `t` is 0-1 progress; the arrows draw and the competing rows fade up as
 * it advances.
 */
export function MarketplaceVsDirect({ t }: { t: number }) {
  const clamp = (n: number) => Math.min(1, Math.max(0, n));
  const draw = clamp(t * 1.5);
  const rivals = clamp((t - 0.25) * 2);

  const rows = [
    { y: 74, name: "Cut & Co.", you: false },
    { y: 106, name: "The Barber Room", you: false },
    { y: 138, name: "Your salon", you: true },
    { y: 170, name: "Studio Nine", you: false },
    { y: 202, name: "Hair Lounge", you: false },
  ];

  return (
    <svg
      viewBox="0 0 460 430"
      className="w-full"
      role="img"
      aria-label="A marketplace shows your client four competitors alongside you; your own link shows only you."
    >
      <text x="0" y="14" className="fill-ink-3 font-mono" fontSize="10" letterSpacing="1.4">
        A MARKETPLACE
      </text>

      <circle cx="34" cy="46" r="8" className="fill-ink" opacity={draw} />
      <text x="50" y="50" className="fill-ink-2 font-mono" fontSize="9.5" opacity={draw}>
        your client
      </text>

      <rect
        x="0"
        y="60"
        width="460"
        height="158"
        rx="2"
        className="fill-none stroke-line-2"
        strokeWidth="1"
        opacity={draw}
      />

      {rows.map((r) => {
        const on = r.you ? draw : rivals;
        return (
          <g key={r.name} opacity={on}>
            <rect
              x="12"
              y={r.y - 11}
              width="436"
              height="22"
              rx="1"
              className={r.you ? "fill-acid" : "fill-ink/[0.06]"}
            />
            <text
              x="22"
              y={r.y + 4}
              fontSize="10.5"
              className={r.you ? "fill-[#0f1111] font-mono" : "fill-ink-2 font-mono"}
            >
              {r.name}
            </text>
            {!r.you && (
              <text x="438" y={r.y + 4} textAnchor="end" fontSize="9" className="fill-ink-3 font-mono">
                BOOK
              </text>
            )}
            <path
              d={`M34 56 L34 ${r.y} L12 ${r.y}`}
              className="fill-none stroke-ink-3"
              strokeWidth="1"
              strokeDasharray="180"
              strokeDashoffset={180 * (1 - on)}
              opacity={r.you ? 0.9 : 0.5}
            />
          </g>
        );
      })}

      <text x="0" y="240" className="fill-ink-3 font-mono" fontSize="9.5" opacity={rivals}>
        four competitors on the page they came to book you on
      </text>

      <text x="0" y="296" className="fill-ink-3 font-mono" fontSize="10" letterSpacing="1.4">
        YOUR OWN LINK
      </text>

      <circle cx="34" cy="336" r="8" className="fill-ink" opacity={draw} />
      <text x="50" y="340" className="fill-ink-2 font-mono" fontSize="9.5" opacity={draw}>
        your client
      </text>

      <path
        d="M34 348 L34 386 L150 386"
        className="fill-none stroke-ink"
        strokeWidth="1.5"
        strokeDasharray="160"
        strokeDashoffset={160 * (1 - draw)}
      />
      <path
        d="M144 381 l7 5 -7 5"
        className="fill-none stroke-ink"
        strokeWidth="1.5"
        opacity={clamp((t - 0.5) * 3)}
      />

      <rect x="158" y="368" width="290" height="36" rx="2" className="fill-acid" opacity={draw} />
      <text x="172" y="391" fontSize="11.5" className="fill-[#0f1111] font-mono" opacity={draw}>
        luxehairstudio.com/book
      </text>

      <text
        x="0"
        y="424"
        className="fill-ink-3 font-mono"
        fontSize="9.5"
        opacity={clamp((t - 0.55) * 3)}
      >
        no directory, no competitors, no commission
      </text>
    </svg>
  );
}
