"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "div" | "article" | "section";
  delay?: number;
};

/** One entrance per visit; the element itself animates so grid layout stays intact. */
export function Reveal({ children, className = "", id, as = "div", delay = 0 }: RevealProps) {
  const reducedMotion = useReducedMotion();
  const Component = as === "article" ? motion.article : as === "section" ? motion.section : motion.div;

  return <Component
    id={id}
    className={`motion-reveal ${className}`}
    initial={{ opacity: 0, transform: reducedMotion ? "none" : "translateY(24px)" }}
    whileInView={{ opacity: 1, transform: reducedMotion ? "none" : "translateY(0px)" }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: reducedMotion ? 0.12 : 0.6, delay: reducedMotion ? 0 : delay, ease: [0.23, 1, 0.32, 1] }}
  >{children}</Component>;
}
