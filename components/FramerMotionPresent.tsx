"use client";
import { AnimatePresence } from "framer-motion";
import React from "react";

const FramerMotionPresent = ({ children }: { children: React.ReactNode }) => {
  return <AnimatePresence>{children}</AnimatePresence>;
};

export default FramerMotionPresent;
