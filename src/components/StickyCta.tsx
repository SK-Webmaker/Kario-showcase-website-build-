import { useEffect, useState } from "react";

/**
 * A persistent way back to the one action on this page. Appears once the
 * hero is behind the visitor and hides itself while the contact section
 * is on screen, so it never covers the form it points at.
 */
export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    let atContact = false;

    const onScroll = () => {
      setShow(window.scrollY > window.innerHeight * 1.4 && !atContact);
    };

    let io: IntersectionObserver | undefined;
    if (contact) {
      io = new IntersectionObserver(
        (entries) => {
          atContact = entries[0]?.isIntersecting ?? false;
          onScroll();
        },
        { rootMargin: "-10% 0px -10% 0px" },
      );
      io.observe(contact);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ground/95 backdrop-blur-md
                 px-4 pt-3 lg:hidden"
      style={{
        paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
        transform: show ? "translateY(0)" : "translateY(110%)",
        opacity: show ? 1 : 0,
        pointerEvents: show ? "auto" : "none",
        transition:
          "transform 660ms cubic-bezier(.22,1,.36,1), opacity 320ms cubic-bezier(.22,1,.36,1)",
      }}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-3">
        <p className="min-w-0 flex-1 text-[12.5px] leading-snug text-ink-2">
          $410 once. No commission, ever.
        </p>
        <a
          href="/get-in-touch"
          tabIndex={show ? 0 : -1}
          className="btn-brand shrink-0 !px-5 !py-3 text-[13.5px]"
        >
          Contact us
        </a>
      </div>
    </div>
  );
}
