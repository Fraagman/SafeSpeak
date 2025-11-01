"use client";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={path}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0, transition: { duration: .4, ease: "easeOut" } }}
        exit={{ opacity: 0, y: -6, transition: { duration: .3 } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

