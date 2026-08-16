import { PhoneFrame } from "./ui/DeviceFrame";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { shot } from "@/site.config";

const PHONES = [
  {
    file: "23-phone-dashboard.jpg",
    alt: "The Kairo dashboard on a phone, showing the day's figures and who is in the chair.",
    caption: "The day, in your pocket",
    lift: "translate-y-6",
  },
  {
    file: "24-phone-calendar.jpg",
    alt: "The day calendar on a phone, with appointments stacked by time.",
    caption: "The book, on the floor",
    lift: "",
  },
  {
    file: "25-phone-booking.jpg",
    alt: "The public booking page on a phone, where most customers book.",
    caption: "Where customers actually book",
    lift: "translate-y-6",
  },
];

export function PhoneTrio() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="shell relative">
        <SectionHeading
          align="center"
          eyebrow="in the hand"
          title="Phone-first, not phone-tolerant"
          lede="You run the salon from an apron pocket, so every screen was built for a thumb first and a desktop second. It installs to the home screen straight from the browser — no app store, no download, no update to remember."
        />

        <div className="mt-16 flex items-start justify-center gap-3 sm:gap-6 lg:gap-10">
          {PHONES.map((p, i) => (
            <Reveal key={p.file} delay={i * 110} className={`flex-1 ${p.lift}`}>
              <figure className="mx-auto max-w-[230px]">
                <PhoneFrame>
                  <img
                    src={shot(p.file)}
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                    className="block w-full"
                  />
                </PhoneFrame>
                <figcaption className="mt-4 text-center text-[12.5px] leading-snug text-ink-3">
                  {p.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
