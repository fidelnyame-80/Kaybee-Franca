"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const menuItems = [
  { href: "#top", label: "Home", icon: "home", x: -9, y: -132 },
  { href: "#our-day", label: "Our day", icon: "calendar", x: -57, y: -119 },
  { href: "#moments", label: "Our story", icon: "heart", x: -96, y: -90 },
  { href: "#gallery", label: "Photo gallery", icon: "gallery", x: -123, y: -48 },
  { href: "#venue", label: "Venue", icon: "pin", x: -132, y: 0 },
  { href: "#rsvp", label: "Show us some love", icon: "gift", x: -123, y: 48 },
  { href: "#memories", label: "Couple memories", icon: "camera", x: -96, y: 90 },
  { href: "#quiz", label: "Couple quiz", icon: "quiz", x: -57, y: 119 },
  { href: "#bingo", label: "Wedding bingo", icon: "bingo", x: -9, y: 132 },
];

function MenuIcon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.7,
  };

  switch (name) {
    case "home":
      return <svg viewBox="0 0 24 24" {...common}><path d="m3 10 9-7 9 7" /><path d="M5 9v12h14V9M9 21v-7h6v7" /></svg>;
    case "calendar":
      return <svg viewBox="0 0 24 24" {...common}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>;
    case "heart":
      return <svg viewBox="0 0 24 24" {...common}><path d="M20.8 8.7c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z" /></svg>;
    case "gallery":
      return <svg viewBox="0 0 24 24" {...common}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>;
    case "pin":
      return <svg viewBox="0 0 24 24" {...common}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
    case "gift":
      return <svg viewBox="0 0 24 24" {...common}><path d="M3 10h18v11H3zM2 6h20v4H2zM12 6v15M12 6H7.5a2.5 2.5 0 1 1 2.3-3.5L12 6Zm0 0h4.5a2.5 2.5 0 1 0-2.3-3.5L12 6Z" /></svg>;
    case "camera":
      return <svg viewBox="0 0 24 24" {...common}><path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v10H2V9a2 2 0 0 1 2-2Z" /><circle cx="12" cy="13" r="3.5" /></svg>;
    case "quiz":
      return <svg viewBox="0 0 24 24" {...common}><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.6 2.6 0 1 1 4.4 1.9c-1.1 1-1.9 1.3-1.9 3M12 17.5v.1" /></svg>;
    default:
      return <svg viewBox="0 0 24 24" {...common}><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /></svg>;
  }
}

export default function FloatingMenu({ visible }: { visible: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const elements = itemsRef.current.filter(
      (item): item is HTMLAnchorElement => item !== null,
    );
    if (!elements.length) return;

    gsap.killTweensOf(elements);
    if (isOpen) {
      gsap.fromTo(
        elements,
        { x: 0, y: 0, autoAlpha: 0, scale: 0.45, rotate: -18 },
        {
          x: (index) => menuItems[index].x,
          y: (index) => menuItems[index].y,
          autoAlpha: 1,
          scale: 1,
          rotate: 0,
          duration: 0.55,
          stagger: 0.045,
          ease: "power3.out",
        },
      );
    } else {
      gsap.to(elements, {
        x: 0,
        y: 0,
        autoAlpha: 0,
        scale: 0.45,
        rotate: 12,
        duration: 0.24,
        stagger: { each: 0.018, from: "end" },
        ease: "power2.in",
      });
    }

    return () => gsap.killTweensOf(elements);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  if (!visible) return null;

  return (
    <>
      {isOpen && (
        <button
          className="floating-menu__backdrop"
          type="button"
          aria-label="Close the wedding menu"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className={`floating-menu${isOpen ? " floating-menu--open" : ""}`}>
        <nav
          id="wedding-section-menu"
          className="floating-menu__items"
          aria-label="Wedding sections"
          aria-hidden={!isOpen}
        >
          {menuItems.map((item, index) => (
            <a
              key={item.href}
              ref={(element) => { itemsRef.current[index] = element; }}
              className="floating-menu__item"
              href={item.href}
              aria-label={item.label}
              title={item.label}
              tabIndex={isOpen ? 0 : -1}
              onClick={() => setIsOpen(false)}
            >
              <MenuIcon name={item.icon} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <button
          ref={toggleRef}
          className="floating-menu__toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="wedding-section-menu"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? "CLOSE" : "MENU"}
        </button>
      </div>
    </>
  );
}
