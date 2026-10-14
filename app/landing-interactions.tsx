"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon, PhonePreview } from "./product-preview";
import { Reveal } from "./reveal";

const easeOut = [0.23, 1, 0.32, 1] as const;
const bookingUrl = process.env.NEXT_PUBLIC_MOLT_DEMO_URL;
const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#app", label: "The app" },
  { href: "#faq", label: "FAQ" },
];

export function DemoButton({ className = "", label = "Request a demo" }: { className?: string; label?: string }) {
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  function showDialog() {
    dialog.current?.showModal();
    setOpen(true);
  }

  if (bookingUrl && /^https:\/\//.test(bookingUrl)) {
    return <a className={`button ${className}`} href={bookingUrl}>{label}<Icon name="arrow" /></a>;
  }

  return <>
    <button ref={trigger} className={`button ${className}`} onClick={showDialog}>{label}<Icon name="arrow" /></button>
    <motion.dialog
      ref={dialog}
      className="demo-dialog"
      aria-labelledby={titleId}
      data-visible={open}
      initial={false}
      animate={{ opacity: open ? 1 : 0, transform: reducedMotion || open ? "translateY(0px) scale(1)" : "translateY(12px) scale(0.96)" }}
      transition={{ duration: reducedMotion ? 0.12 : 0.24, ease: easeOut }}
      onAnimationComplete={() => { if (!open && dialog.current?.open) dialog.current.close(); }}
      onCancel={event => { event.preventDefault(); setOpen(false); }}
      onClose={() => { setOpen(false); trigger.current?.focus(); }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setOpen(false);
      }}
    >
      <button className="dialog-close" aria-label="Close demo information" onClick={() => setOpen(false)}><Icon name="close" /></button>
      <span className="icon-tile lemon"><Icon name="barn" /></span>
      <span className="eyebrow">LET’S BRING YOUR FARM INTO VIEW</span>
      <h2 id={titleId}>A clearer view starts<br />with your farm.</h2>
      <p>Molt’s demo booking is being set up. Once it’s available, you’ll be able to discuss your farm, team access and supported camera setup here.</p>
      <div className="demo-pending"><span className="small-dot" /> Demo booking is not available yet.</div>
      <button className="button" onClick={() => setOpen(false)}>Keep exploring <Icon name="arrow" /></button>
    </motion.dialog>
  </>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
    };
    const onResize = () => { if (window.innerWidth > 760) setOpen(false); };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { document.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, [open]);

  return <header className="site-header">
    <div className="container header-inner">
      <a href="#hero-title" aria-label="Molt home"><Image className="logo" src="/brand/label-logo.svg" alt="Molt" width={109} height={40} /></a>
      <nav className="main-nav" aria-label="Main navigation">{navLinks.map(link => <a href={link.href} key={link.href}>{link.label}</a>)}</nav>
      <div className="header-actions">
        <DemoButton />
        <button ref={menuButton} className="menu-button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button>
      </div>
      <AnimatePresence initial={false}>
        {open && <motion.nav
          key="mobile-menu"
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
          initial={{ opacity: 0, transform: reducedMotion ? "none" : "translateY(-8px) scale(0.98)" }}
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          exit={{ opacity: 0, transform: reducedMotion ? "none" : "translateY(-8px) scale(0.98)" }}
          transition={{ duration: reducedMotion ? 0.1 : 0.2, ease: easeOut }}
        >{navLinks.map(link => <a href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}</motion.nav>}
      </AnimatePresence>
    </div>
  </header>;
}

const screens = [
  { id: "home", title: "Your daily overview", heading: "Start with the big picture.", text: "See your recorded flock, latest detected birds and area status in one simple overview. Then look closer at the detail that needs your attention.", points: ["Farm, barn and area context", "Camera counts beside flock records", "Clear missing and partial count states"] },
  { id: "batches", title: "Your flock batches", heading: "Follow the whole flock cycle.", text: "Keep arrival dates, placements and growing progress together. Review recorded bird activity across active, completed and archived batches.", points: ["Growing-cycle progress", "Area placements and bird records", "Active, completed and archived views"] },
  { id: "live", title: "Your connected views", heading: "See the area behind the count.", text: "Open available camera views organized by barn and area. Review coverage and camera context before requesting a snapshot or recount.", points: ["Connected camera views", "Available snapshots and history", "Honest camera availability states"] },
];

export function AppShowcase() {
  const [selected, setSelected] = useState(0);
  const [keyboardChange, setKeyboardChange] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const instant = reducedMotion || keyboardChange;

  function navigateTabs(event: React.KeyboardEvent, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % screens.length;
    else if (event.key === "ArrowLeft") next = (index + screens.length - 1) % screens.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = screens.length - 1;
    else return;
    event.preventDefault();
    setKeyboardChange(true);
    setSelected(next);
    tabRefs.current[next]?.focus();
  }

  return <section id="app" className="app-section">
    <div className="container section">
      <Reveal className="section-heading centered">
        <span className="eyebrow">MEET YOUR NEW DAILY VIEW</span>
        <h2>Your farm in your pocket.<br />Clarity at your fingertips.</h2>
        <p>A simple overview. The right details. A familiar view,<br className="desktop-break" /> wherever the work takes you.</p>
      </Reveal>
      <div className="app-tabs" role="tablist" aria-label="Explore Molt screens">
        {screens.map((item, index) => <button
          ref={element => { tabRefs.current[index] = element; }}
          id={`tab-${item.id}`}
          key={item.id}
          role="tab"
          aria-selected={selected === index}
          aria-controls={`panel-${item.id}`}
          tabIndex={selected === index ? 0 : -1}
          onClick={event => { setKeyboardChange(event.detail === 0); setSelected(index); }}
          onKeyDown={event => navigateTabs(event, index)}
        ><Icon name={index === 0 ? "home" : index === 1 ? "layers" : "camera"} />{["Home", "Batches", "Live"][index]}</button>)}
      </div>
      {screens.map((screen, index) => <div
        key={screen.id}
        hidden={selected !== index}
        className="app-panel-host"
        id={`panel-${screen.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${screen.id}`}
        tabIndex={0}
      >
        {selected === index && <motion.div
          className="app-panel"
          initial={instant ? false : { opacity: 0, transform: "translateY(16px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: instant ? 0 : 0.28, ease: easeOut }}
        >
        <div className="app-preview"><div className="app-orbit" aria-hidden="true" /><PhonePreview screen={screen.id} /><span className="illustration-note">Illustrative preview · sample records, not live data</span></div>
        <div className="app-panel-copy">
          <span className="eyebrow">{screen.title}</span><h3>{screen.heading}</h3><p>{screen.text}</p>
          <ul className="check-list">{screen.points.map(point => <li key={point}><Icon name="check" />{point}</li>)}</ul>
          <a className="text-link" href="#contact">See how it fits your farm <Icon name="arrow" /></a>
        </div>
        </motion.div>}
      </div>)}
    </div>
  </section>;
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const buttonId = useId();
  const reducedMotion = useReducedMotion();

  return <div className="faq-item">
    <h3><button id={buttonId} className="faq-question" aria-expanded={open} aria-controls={contentId} onClick={() => setOpen(!open)}>
      {question}<motion.span className="faq-plus" aria-hidden="true" initial={false} animate={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }} transition={{ duration: reducedMotion ? 0 : 0.2, ease: easeOut }}>+</motion.span>
    </button></h3>
    <motion.div id={contentId} className="faq-answer" aria-labelledby={buttonId} aria-hidden={!open} inert={!open} initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: reducedMotion ? 0 : 0.2, ease: easeOut }}>
      <p>{answer}</p>
    </motion.div>
  </div>;
}

export function FaqList({ items }: { items: string[][] }) {
  return <div className="faq-list">{items.map(([question, answer]) => <FaqItem key={question} question={question} answer={answer} />)}</div>;
}
