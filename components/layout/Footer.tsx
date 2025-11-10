"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Twitter, Facebook, Mail, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

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

        <div className="py-8 border-t border-b border-emerald-100">
          <div className="text-center mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">
              Powered By Our Amazing Partners
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="text-gray-900 font-bold text-2xl px-5 py-2 bg-emerald-50 rounded-lg border border-emerald-200"
              >
                LupLu
              </motion.div>

              <div className="w-px h-12 bg-emerald-200" />

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="text-gray-800 font-semibold text-xl px-5 py-2 bg-emerald-50 rounded-lg border border-emerald-200"
              >
                IKIGAI
              </motion.div>

              <div className="w-px h-12 bg-emerald-200" />

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="text-gray-700 font-medium text-lg px-5 py-2 bg-emerald-50 rounded-lg border border-emerald-200"
              >
                Delhi Heights
              </motion.div>
            </div>
          </div>
        </div>

        <div className="pt-8">
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
