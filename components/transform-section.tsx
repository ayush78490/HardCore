"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export function TransformSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden" ref={ref}>
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            <motion.span
              initial={{ opacity: 0, rotateX: -90 }}
              animate={isInView ? { opacity: 1, rotateX: 0 } : { opacity: 0, rotateX: -90 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-block"
            >
              Transform Your Playtime
            </motion.span>
            <br />
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 inline-block"
              initial={{ opacity: 0, rotateX: -90 }}
              animate={isInView ? { opacity: 1, rotateX: 0 } : { opacity: 0, rotateX: -90 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              into Profits.
            </motion.span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Experience the future of gaming with our session-based Web3 platform. Play games to earn real rewards in our
            Play2Earn ecosystem, and if you're a Unity developer, create games and keep 80% of the revenue. Join us to
            play, earn, and develop in a secure, decentralized environment!
          </motion.p>
        </div>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-4 h-4 bg-orange-500/20 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-10 w-6 h-6 bg-red-500/20 rounded-full"
        animate={{
          y: [0, 20, 0],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          delay: 2,
        }}
      />
    </section>
  )
}
