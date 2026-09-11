import { PhoneFrame } from "./ui/DeviceFrame";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { shot } from "@/site.config";

const PHONES = [
  {
    file: "23-phone-dashboard.jpg",
    alt: "The Kairo dashboard on a phone.",
    cap: "The day, in your pocket",
  },
  {
    file: "24-phone-calendar.jpg",
    alt: "The day calendar on a phone.",
    cap: "The book, on the floor",
  },
  {
    file: "25-phone-booking.jpg",
    alt: "The booking page on a phone.",
    cap: "Where customers book",
  },
];

export function PhoneTrio() {
  return (
    <section className="border-t border-line py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          index="07"
          eyebrow="In the hand"
          lines={["Phone-first,", "not phone-tolerant."]}
          lede="You run the business on your feet, not at a desk, so every screen was built for a thumb first and a desktop second. It installs to the home screen straight from the browser — no app store, no download, nothing to update."
          className="max-w-3xl"
        />

        <div className="mt-16 grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-12">
          {PHONES.map((p, i) => (
            <Reveal key={p.file} delay={i * 110}>
              <figure>
                <PhoneFrame className="mx-auto max-w-[220px]">
                  <img
                    src={shot(p.file)}
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                    className="block w-full"
                  />
                </PhoneFrame>
                <figcaption className="chrome mt-5 text-center">
                  [{String(i + 1).padStart(2, "0")}] {p.cap}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
