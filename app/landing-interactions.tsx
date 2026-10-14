"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { Icon, PhonePreview } from "./product-preview";

// Only connect this to an approved public booking destination.
const bookingUrl = process.env.NEXT_PUBLIC_MOLT_DEMO_URL;
const navLinks = [{ href: "#features", label: "Features" }, { href: "#how-it-works", label: "How it works" }, { href: "#app", label: "The app" }, { href: "#faq", label: "FAQ" }];

export function DemoButton({ className = "", label = "Request a demo" }: { className?: string; label?: string }) {
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  if (bookingUrl && /^https:\/\//.test(bookingUrl)) return <a className={`button ${className}`} href={bookingUrl}>{label}<Icon name="arrow" /></a>;
  return <>
    <button ref={trigger} className={`button ${className}`} onClick={() => dialog.current?.showModal()}>{label}<Icon name="arrow" /></button>
    <dialog ref={dialog} className="demo-dialog" aria-labelledby={titleId} onClose={() => trigger.current?.focus()} onClick={event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current?.close(); } }}>
      <button className="dialog-close" aria-label="Close demo information" onClick={() => dialog.current?.close()}><Icon name="close" /></button>
      <span className="icon-tile lemon"><Icon name="barn" /></span><span className="eyebrow">LET’S BRING YOUR FARM INTO VIEW</span><h2 id={titleId}>A clearer view starts<br />with your farm.</h2><p>Molt’s demo booking is being set up. Once it’s available, you’ll be able to discuss your farm, team access and supported camera setup here.</p><div className="demo-pending"><span className="small-dot" /> Demo booking is not available yet.</div><button className="button" onClick={() => dialog.current?.close()}>Keep exploring <Icon name="arrow" /></button>
    </dialog>
  </>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); } };
    const onResize = () => { if (window.innerWidth > 760) setOpen(false); };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { document.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, [open]);
  return <header className="site-header"><div className="container header-inner"><a href="#hero-title" aria-label="Molt home"><Image className="logo" src="/brand/label-logo.svg" alt="Molt" width={109} height={40} /></a><nav id="main-navigation" className={`main-nav ${open ? "is-open" : ""}`} aria-label="Main navigation">{navLinks.map(link => <a href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}</nav><div className="header-actions"><DemoButton /><button ref={menuButton} className="menu-button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button></div></div></header>;
}

const screens = [
  { id: "home", title: "Your daily overview", heading: "Start with the big picture.", text: "See your recorded flock, latest detected birds and area status in one simple overview. Then look closer at the detail that needs your attention.", points: ["Farm, barn and area context", "Camera counts beside flock records", "Clear missing and partial count states"] },
  { id: "batches", title: "Your flock batches", heading: "Follow the whole flock cycle.", text: "Keep arrival dates, placements and growing progress together. Review recorded bird activity across active, completed and archived batches.", points: ["Growing-cycle progress", "Area placements and bird records", "Active, completed and archived views"] },
  { id: "live", title: "Your connected views", heading: "See the area behind the count.", text: "Open available camera views organized by barn and area. Review coverage and camera context before requesting a snapshot or recount.", points: ["Connected camera views", "Available snapshots and history", "Honest camera availability states"] },
];

export function AppShowcase() {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  function navigateTabs(event: React.KeyboardEvent, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % screens.length;
    else if (event.key === "ArrowLeft") next = (index + screens.length - 1) % screens.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = screens.length - 1;
    else return;
    event.preventDefault(); setSelected(next); tabRefs.current[next]?.focus();
  }
  return <section id="app" className="app-section"><div className="container section"><div className="section-heading centered"><span className="eyebrow">MEET YOUR NEW DAILY VIEW</span><h2>Your farm in your pocket.<br />Clarity at your fingertips.</h2><p>A simple overview. The right details. A familiar view,<br className="desktop-break" /> wherever the work takes you.</p></div><div className="app-tabs" role="tablist" aria-label="Explore Molt screens">{screens.map((item, index) => <button ref={element => { tabRefs.current[index] = element; }} id={`tab-${item.id}`} key={item.id} role="tab" aria-selected={selected === index} aria-controls={`panel-${item.id}`} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => navigateTabs(event, index)}><Icon name={index === 0 ? "home" : index === 1 ? "layers" : "camera"} />{["Home", "Batches", "Live"][index]}</button>)}</div>{screens.map((screen, index) => <div key={screen.id} hidden={selected !== index} className="app-panel" id={`panel-${screen.id}`} role="tabpanel" aria-labelledby={`tab-${screen.id}`} tabIndex={0}><div className="app-preview"><div className="app-orbit" aria-hidden="true" /><PhonePreview screen={screen.id} /><span className="illustration-note">Illustrative preview · sample records, not live data</span></div><div className="app-panel-copy"><span className="eyebrow">{screen.title}</span><h3>{screen.heading}</h3><p>{screen.text}</p><ul className="check-list">{screen.points.map(point => <li key={point}><Icon name="check" />{point}</li>)}</ul><a className="text-link" href="#contact">See how it fits your farm <Icon name="arrow" /></a></div></div>)}</div></section>;
}
