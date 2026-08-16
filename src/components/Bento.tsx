import type { ReactNode } from "react";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { shot } from "@/site.config";

type CardProps = {
  span: string;
  title: string;
  body: string;
  /** Optional screenshot, cropped to the top of the frame. */
  image?: { file: string; alt: string };
  children?: ReactNode;
  delay?: number;
};

function BentoCard({ span, title, body, image, children, delay = 0 }: CardProps) {
  return (
    <Reveal delay={delay} className={span}>
      <div
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl
                   border border-edge bg-panel/70 transition-colors duration-300
                   hover:border-edge-2"
      >
        <div className="p-6">
          <h3 className="text-[16.5px] font-bold tracking-[-0.015em] text-ink">
            {title}
          </h3>
          <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">{body}</p>
        </div>

        {children && <div className="px-6 pb-6">{children}</div>}

        {image && (
          <div className="relative mt-auto px-6 pb-0">
            <div
              className="overflow-hidden rounded-t-xl border-x border-t border-edge-2
                         bg-ground"
            >
              <img
                src={shot(image.file)}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="block w-full origin-top transition-transform duration-500
                           group-hover:scale-[1.03]"
              />
            </div>
          </div>
        )}
      </div>
    </Reveal>
  );
}

/** Small stat row used inside the text-only cards. */
function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-edge bg-panel-2/60 px-3.5 py-3">
      <p className="text-[19px] font-extrabold leading-none tracking-tight text-ink tabular">
        {value}
      </p>
      <p className="mt-1.5 text-[11.5px] leading-tight text-ink-3">{label}</p>
    </div>
  );
}

export function Bento() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="and the rest of it"
          title="Everything else the day needs, already in the box"
          lede="No tiers that hide the useful half, no add-on that turns out to cost more than the software. What follows is simply part of it."
        />

        <div className="mt-14 grid gap-4 sm:gap-5 lg:grid-cols-6">
          <BentoCard
            span="lg:col-span-4"
            title="Know which hours are worth protecting"
            body="Appointments by hour of day, revenue per day, and the services actually carrying the business. The quiet Tuesday afternoon shows up as a shape, not a hunch."
            image={{
              file: "03-dashboard-charts.jpg",
              alt: "Charts showing bookings by hour of day, revenue per day and top-selling services.",
            }}
          />

          <BentoCard
            span="lg:col-span-2"
            title="The clients who quietly drifted"
            body="Two or more past visits, nothing in eight weeks, nothing booked. Kairo builds the list; you send the message."
            delay={80}
          >
            <div className="grid grid-cols-2 gap-2.5">
              <MiniStat value="2+" label="Past visits" />
              <MiniStat value="8 wks" label="Since last seen" />
              <MiniStat value="0" label="Booked ahead" />
              <MiniStat value="1 tap" label="To reach them" />
            </div>
          </BentoCard>

          <BentoCard
            span="lg:col-span-2"
            title="A menu that prices like a salon does"
            body="Fixed, “from” for anything that varies with hair length, and free for consultations. Categories, durations and prices that the booking page reads straight off."
            image={{
              file: "10-services.jpg",
              alt: "The service menu with categories, durations and fixed, from and free price types.",
            }}
            delay={40}
          />

          <BentoCard
            span="lg:col-span-2"
            title="Retail that pays for its shelf"
            body="Cost against retail margin, stock counted down as it sells, and a warning while there's still time to reorder."
            image={{
              file: "13-products.jpg",
              alt: "Retail product list showing stock levels, cost versus retail margin and low-stock warnings.",
            }}
            delay={80}
          />

          <BentoCard
            span="lg:col-span-2"
            title="Reviews you didn't have to ask for"
            body="A request goes out after the visit, on its own. The reviews land on your own page, and you can reply to them."
            image={{
              file: "15-reviews.jpg",
              alt: "Collected reviews with ratings and the salon's replies.",
            }}
            delay={120}
          />

          <BentoCard
            span="lg:col-span-3"
            title="Set the hours once and stop thinking about them"
            body="Opening hours per day — including days that run only every 2nd, 3rd or 4th week. How far ahead customers may book. The notice period after which the online cancel link stops working and they're asked to call instead."
            image={{
              file: "16-settings-hours.jpg",
              alt: "Opening hours settings with per-day hours, booking window and cancellation notice.",
            }}
          />

          <BentoCard
            span="lg:col-span-3"
            title="Your team, their colours, their hours"
            body="Each person gets a colour that runs through the whole calendar, a title, and their own working hours — so the book never offers a customer a slot with someone who isn't in that day."
            image={{
              file: "18-team.jpg",
              alt: "The team list with each member's colour, title and working hours.",
            }}
            delay={80}
          />
        </div>
      </div>
    </section>
  );
}
