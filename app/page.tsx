"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { TransformSection } from "@/components/transform-section"
import { FeaturesSection } from "@/components/features-section"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <motion.div
      className="min-h-screen bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <HeroSection />
      <TransformSection />
      <FeaturesSection />
    </motion.div>
  )
}
