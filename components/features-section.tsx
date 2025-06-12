"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Coins, Code, Shield, Gamepad } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const features = [
  {
    icon: Coins,
    title: "Earn as You Play",
    description: "Accumulate rewards through in-game achievements and progress on the Core blockchain.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Code,
    title: "Develop and Earn",
    description:
      "Unity developers can design and launch games on our platform, keeping a significant portion (80%) of the revenue.",
    color: "from-blue-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Decentralized",
    description: "Effortless token distribution, NFT asset marketplace, community rewards, and diverse gameplay.",
    color: "from-green-500 to-teal-500",
  },
  {
    icon: Gamepad,
    title: "Multiple Games",
    description: "Explore and play over 5 exciting games, earn rewards and dominate the leaderboards.",
    color: "from-red-500 to-pink-500",
  },
]

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden" ref={ref}>
      {/* Background grid animation */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Platform Features
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover what makes Hardcore Gaming the ultimate Web3 gaming platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.2 },
              }}
              className="perspective-1000"
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-all duration-300 overflow-hidden relative group">
                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)`,
                  }}
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3,
                  }}
                />

                <CardContent className="p-8 relative z-10">
                  <motion.div
                    className="mb-6"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1 + 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 relative overflow-hidden`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <feature.icon className="w-8 h-8 text-white relative z-10" />
                    </div>

                    <motion.h3
                      className="text-2xl font-bold text-white mb-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
                    >
                      {feature.title}
                    </motion.h3>

                    <motion.p
                      className="text-gray-300 leading-relaxed"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.7 }}
                    >
                      {feature.description}
                    </motion.p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating background elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-orange-500/10 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </section>
  )
}
