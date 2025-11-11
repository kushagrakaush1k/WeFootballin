"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Twitter, Facebook, Mail, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const sponsors = [
    { name: "LUPLU", logo: "/images/luplu-logo.png" },
    { name: "XTCY", logo: "/images/XTCY-logo.png" },
    { name: "LOOKS SALON", logo: "/images/Looks-salon-logo.png" },
    { name: "IKIGAI", logo: "/images/ikigai-logo.png" },
    { name: "DELHI HEIGHTS", logo: "/images/delhi-heights-logo.png" },
    { name: "ROYAL GREEN", logo: "/images/royal-green-logo.png" },
  ];

  const links = {
    platform: [
      { label: "Home", href: "/" },
      { label: "Leaderboard", href: "/leaderboard" },
      { label: "Blog", href: "/blog" },
      { label: "Register Team", href: "/register-team" },
    ],
    support: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
    social: [
      { icon: Instagram, href: "#", label: "Instagram" },
      { icon: Twitter, href: "#", label: "Twitter" },
      { icon: Facebook, href: "#", label: "Facebook" },
    ],
  };

  return (
    <footer className="relative bg-gradient-to-b from-white to-emerald-50/40 border-t border-emerald-100 pt-16 pb-8">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0fdf4_1px,transparent_1px),linear-gradient(to_bottom,#f0fdf4_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <Image
              src="/images/wefootballin-logo.png"
              alt="WeFootballin"
              width={160}
              height={55}
              className="object-contain"
            />
            <p className="text-gray-600 text-sm leading-relaxed">
              Your ultimate football community platform. Connect, compete, and
              conquer together.
            </p>
            <div className="flex gap-2">
              {links.social.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-emerald-600" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 font-bold text-base mb-4">Platform</h3>
            <ul className="space-y-2">
              {links.platform.map((link, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-emerald-600 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-bold text-base mb-4">Support</h3>
            <ul className="space-y-2">
              {links.support.map((link, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-emerald-600 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-bold text-base mb-4">
              Stay Updated
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Get the latest updates about matches and tournaments
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg transition-all shadow-sm"
              >
                <Mail className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Sponsors Section - Clean Grid Layout */}
        <div className="py-10 border-t border-emerald-100">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Our Official Partners
            </p>
            <p className="text-sm text-gray-600">
              Proudly supported by these amazing brands
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center">
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={sponsor.name}
                whileHover={{ scale: 1.08, y: -4 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow h-24 flex items-center justify-center">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={90}
                    height={60}
                    className="object-contain brightness-110 contrast-105"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-emerald-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <p className="text-gray-600 text-sm flex items-center gap-2">
              © {currentYear} WeFootballin'. Made with
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              in India
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/terms"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-end">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <Image
                src="/images/wefootballin-logo.png"
                alt="WeFootballin"
                width={120}
                height={40}
                className="object-contain"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}