"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { AnimatedText } from "./animated-text"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export function HeroSection() {
  const router = useRouter()

  return (
    <section className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-black to-red-900/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Animated background particles */}
      <div className="absolute inset-0">
        {typeof window !== "undefined" &&
          [...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-500/30 rounded-full"
              initial={{
                x: Math.random() * (window.innerWidth || 1200),
                y: Math.random() * (window.innerHeight || 800),
                opacity: 0,
              }}
              animate={{
                x: Math.random() * (window.innerWidth || 1200),
                y: Math.random() * (window.innerHeight || 800),
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
              }}
            />
          ))}
      </div>

      <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gray-800/50 rounded-full px-6 py-3 mb-8 border border-gray-700"
          >
            <span className="text-gray-300">Introducing HardCore</span>
            <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
              <ArrowRight className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <AnimatedText text="Play. Earn. Dominate with" />
            <br />
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500"
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              <AnimatedText text="HardCore" className="typing" />
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Discover the Future of Gaming on Core Blockchain. Experience a platform built on transparency and fairness,
            ensuring equal opportunities for all HardCore gamers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg relative overflow-hidden"
              onClick={() => router.push("/games")}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">Get Started</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
