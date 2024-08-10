"use client";
import { motion } from "framer-motion";
import React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      exit={{ y: -20, opacity: 0, filter: "blur(10px)" }}
      transition={{ ease: "easeOut", duration: 0.75 }}
    >
      {children}
    </motion.div>
  );
}
