"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function SponsorsSection() {
  const sponsors = [
    {
      name: "LupLu",
      logo: "/logos/luplu.png",
      description: "Premium Sports Beverage",
      size: "large",
    },
    {
      name: "IKIGAI",
      logo: "/logos/ikigai.png",
      description: "Wellness & Lifestyle",
      size: "medium",
    },
    {
      name: "Delhi Heights",
      logo: "/logos/delhi-heights.png",
      description: "Premium Beverages",
      size: "medium",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-emerald-50/20 to-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0fdf4_1px,transparent_1px),linear-gradient(to_bottom,#f0fdf4_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border-2 border-emerald-200 mb-6"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700 uppercase tracking-wide">
              Powered By
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Our Partners
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Proud to be supported by industry-leading brands
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-emerald-50/50 via-white to-green-50/50 backdrop-blur-sm border-2 border-emerald-200 rounded-3xl p-12 mb-16 text-center shadow-lg"
        >
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <p className="text-gray-900 font-black text-5xl md:text-6xl mb-4 tracking-tight">
                LupLu
              </p>
              <p className="text-2xl text-gray-700 font-medium">presents</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <h3 className="text-3xl md:text-4xl font-black mb-2">
                <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  WeFootballin' League
                </span>
              </h3>
              <p className="text-lg text-gray-600">Where Champions Are Made</p>
            </motion.div>
          </div>
        </motion.div>

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
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-white backdrop-blur-sm border-2 border-emerald-200 group-hover:border-emerald-300 rounded-2xl p-8 transition-all duration-300 shadow-md hover:shadow-xl">
                <div
                  className={`mb-6 flex items-center justify-center ${
                    sponsor.size === "large" ? "h-32" : "h-24"
                  }`}
                >
                  <div
                    className={`font-black text-gray-900 ${
                      sponsor.size === "large" ? "text-4xl" : "text-3xl"
                    }`}
                  >
                    {sponsor.name}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 font-medium">
                    {sponsor.description}
                  </p>
                </div>

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/0 to-green-400/0 group-hover:from-emerald-400/5 group-hover:to-green-400/5 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

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
