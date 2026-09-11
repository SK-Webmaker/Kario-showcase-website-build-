import type { ReactNode } from "react";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { shot } from "@/site.config";

type CardProps = {
  span: string;
  n: string;
  title: string;
  body: string;
  image?: { file: string; alt: string };
  children?: ReactNode;
  delay?: number;
};

function Card({ span, n, title, body, image, children, delay = 0 }: CardProps) {
  return (
    <Reveal delay={delay} className={span}>
      <div className="group flex h-full flex-col border border-line bg-raised">
        <div className="p-6">
          <p className="chrome mb-4">[{n}]</p>
          <h3 className="text-[17px] font-bold leading-tight tracking-[-0.01em]">{title}</h3>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-2">{body}</p>
        </div>

        {children && <div className="px-6 pb-6">{children}</div>}

        {image && (
          <div className="mt-auto border-t border-line bg-[#05070c]">
            <img
              src={shot(image.file)}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              className="block w-full origin-top transition-transform duration-[1200ms] ease-66 group-hover:scale-[1.02]"
            />
          </div>
        )}
      </div>
    </Reveal>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div className="border border-line bg-ground px-3.5 py-3">
      <p className="tabular text-[19px] font-extrabold leading-none tracking-tight">{v}</p>
      <p className="mt-1.5 text-[11px] leading-tight text-ink-3">{l}</p>
    </div>
  );
}

export function Bento() {
  return (
    <section id="features" className="border-t border-line py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          index="06"
          eyebrow="And the rest of it"
          lines={["Everything else", "the day needs,", "already in the box."]}
          lede="No tier that hides the useful half, no add-on that costs more than the software. What follows is simply part of it."
          className="max-w-3xl"
        />

        <div className="mt-16 grid gap-4 lg:grid-cols-6">
          <Card
            span="lg:col-span-4"
            n="01"
            title="Know which hours are worth protecting"
            body="Appointments by hour of day, revenue per day, and the services actually carrying the business. The quiet Tuesday afternoon shows up as a shape, not a hunch."
            image={{
              file: "03-dashboard-charts.jpg",
              alt: "Charts of bookings by hour, revenue per day and top services.",
            }}
          />
          <Card
            span="lg:col-span-2"
            n="02"
            title="The clients who quietly drifted"
            body="Two or more past visits, nothing in eight weeks, nothing booked. Kairo builds the list; you send the message."
            delay={80}
          >
            <div className="grid grid-cols-2 gap-2.5">
              <Stat v="2+" l="Past visits" />
              <Stat v="8 wks" l="Since last seen" />
              <Stat v="0" l="Booked ahead" />
              <Stat v="1 tap" l="To reach them" />
            </div>
          </Card>
          <Card
            span="lg:col-span-2"
            n="03"
            title="A menu that prices like the work does"
            body="Fixed, “from” for anything that varies by job, and free for consultations — read straight off by the booking page."
            image={{
              file: "10-services.jpg",
              alt: "The service menu with fixed, from and free price types.",
            }}
            delay={40}
          />
          <Card
            span="lg:col-span-2"
            n="04"
            title="Retail that pays for its shelf"
            body="Cost against retail margin, stock counted down as it sells, and a warning while there's still time to reorder."
            image={{
              file: "13-products.jpg",
              alt: "Retail stock with margins and low-stock warnings.",
            }}
            delay={80}
          />
          <Card
            span="lg:col-span-2"
            n="05"
            title="Reviews you didn't have to ask for"
            body="A request goes out after the visit, on its own. Reviews land on your own page, and you can reply."
            image={{ file: "15-reviews.jpg", alt: "Collected reviews with replies." }}
            delay={120}
          />
          <Card
            span="lg:col-span-3"
            n="06"
            title="Set the hours once and stop thinking about them"
            body="Opening hours per day, including days that run only every 2nd, 3rd or 4th week. How far ahead customers may book. The notice after which the cancel link stops working."
            image={{
              file: "16-settings-hours.jpg",
              alt: "Opening hours, booking window and cancellation notice.",
            }}
          />
          <Card
            span="lg:col-span-3"
            n="07"
            title="Your team, their colours, their hours"
            body="Each person gets a colour that runs through the calendar, a title, and their own working hours — so the page never offers a slot with someone who isn't in."
            image={{ file: "18-team.jpg", alt: "The team with colours, titles and working hours." }}
            delay={80}
          />
        </div>
      </div>
    </section>
  );
}
