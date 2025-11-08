"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function SponsorsSection() {
  const sponsors = [
    {
      name: "LupLu",
      logo: "/logos/luplu.png",
      description: "Premium Sports Beverage",
      size: "large"
    },
    {
      name: "IKIGAI",
      logo: "/logos/ikigai.png",
      description: "Wellness & Lifestyle",
      size: "medium"
    },
    {
      name: "Delhi Heights",
      logo: "/logos/delhi-heights.png",
      description: "Premium Beverages",
      size: "medium"
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-black via-emerald-950/10 to-black">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400 uppercase tracking-wide">Powered By</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Our Partners
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Proud to be supported by industry-leading brands
          </p>
        </motion.div>

        {/* LupLu Presents Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-12 mb-16 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <p className="text-white font-black text-5xl md:text-6xl mb-4 tracking-tight">
                LupLu
              </p>
              <p className="text-2xl text-gray-300 font-medium">presents</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <h3 className="text-3xl md:text-4xl font-black mb-2">
                <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                  WeFootballin' League
                </span>
              </h3>
              <p className="text-lg text-gray-400">
                Where Champions Are Made
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Card */}
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-emerald-500/50 rounded-2xl p-8 transition-all duration-300">
                {/* Logo Container */}
                <div className={`mb-6 flex items-center justify-center ${
                  sponsor.size === 'large' ? 'h-32' : 'h-24'
                }`}>
                  <div className={`font-black text-white ${
                    sponsor.size === 'large' ? 'text-4xl' : 'text-3xl'
                  }`}>
                    {sponsor.name}
                  </div>
                </div>

                {/* Description */}
                <div className="text-center">
                  <p className="text-gray-400 font-medium">
                    {sponsor.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/5 group-hover:to-green-500/5 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 mt-12"
        >
          Together, we're building the future of football in India
        </motion.p>
      </div>
    </section>
  );
}