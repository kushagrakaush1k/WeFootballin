"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Instagram, Twitter, Facebook, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    platform: [
      { label: "Home", href: "/" },
      { label: "Leaderboard", href: "/leaderboard" },
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

  const sponsors = [
    { name: "LupLu", image: "/logos/luplu.png" },
    { name: "IKIGAI", image: "/logos/ikigai.png" },
    { name: "Delhi Heights", image: "/logos/delhi-heights.png" },
  ];

  return (
    <footer className="relative bg-black border-t border-white/10 pt-16 pb-8">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                WeFootballin'
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your ultimate football community platform. Connect, compete, and
              conquer.
            </p>
            <div className="flex gap-3">
              {links.social.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/50 flex items-center justify-center transition-all group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Platform</h3>
            <ul className="space-y-2">
              {links.platform.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              {links.support.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest updates about matches and tournaments
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:border-emerald-500/50 focus:outline-none"
              />
              <button className="p-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors">
                <Mail className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Sponsors Section */}
        <div className="py-8 border-t border-white/10">
          <div className="text-center mb-6">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              Powered By
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-white font-black text-2xl"
              >
                LupLu
              </motion.div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-white font-semibold text-xl"
              >
                IKIGAI
              </motion.div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-white font-medium text-lg"
              >
                Delhi Heights
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} WeFootballin'. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/terms"
                className="text-gray-500 hover:text-emerald-400 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-emerald-400 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="text-gray-500 hover:text-emerald-400 transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
