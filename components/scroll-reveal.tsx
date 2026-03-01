"use client";
import { motion } from "framer-motion";

export function ScrollReveal({ children, active, speed = 0.5 }: { children: React.ReactNode, active: boolean, speed?: number }) {
  if (!active) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: speed }}
    >
      {children}
    </motion.div>
  );
}