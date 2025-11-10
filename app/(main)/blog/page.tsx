"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Share2,
  Bookmark,
  Heart,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  Check,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  category: string;
  image: string; // REPLACE THIS URL WITH YOUR IMAGE
  tags: string[];
}

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Blog posts data - REPLACE image URLs here
  const blogPosts: BlogPost[] = [
    {
      id: "rock8-vision",
      title: "ROCK8 Vision: Revolutionizing Grassroots Football",
      excerpt:
        "Discover how ROCK8 is transforming the landscape of amateur football, creating opportunities for players to shine and communities to unite through the beautiful game.",
      content: [
        "In the heart of every football community lies untapped potential. ROCK8 isn't just a tournament—it's a movement designed to bring grassroots football to the forefront of competitive sports.",
        "Our vision extends beyond the pitch. We're building an ecosystem where talent meets opportunity, where local heroes become recognized athletes, and where every match tells a story worth sharing.",
        "The ROCK8 format introduces innovative gameplay mechanics that keep matches intense and exciting. With shorter, high-energy games, every second counts, every goal matters, and every team has a fighting chance to make their mark.",
        "We believe in the power of community. That's why ROCK8 integrates cutting-edge technology with traditional football values, creating a platform that celebrates both skill and sportsmanship. Our digital leaderboards, live match updates, and community engagement tools ensure that every player's journey is documented and celebrated.",
        "But what truly sets ROCK8 apart is our commitment to accessibility. We're removing barriers to entry, providing professional-grade experiences at the grassroots level, and ensuring that talent—not resources—determines success.",
        "Join us as we redefine what amateur football can be. Whether you're a seasoned player or just starting your journey, ROCK8 offers a stage where passion meets performance, and dreams become reality.",
        "The future of football isn't just about the elite leagues—it's about empowering communities, one match at a time. Welcome to the ROCK8 revolution.",
      ],
      author: {
        name: "WeFootballin Team",
        role: "Tournament Organizers",
        avatar: "/images/wefootballin-logo.png", // REPLACE with author image if needed
      },
      date: "November 10, 2025",
      readTime: "5 min read",
      category: "Tournament Insights",
      image: "/images/rock8.png", // REPLACE THIS URL
      tags: ["ROCK8", "Grassroots Football", "Community", "Innovation"],
    },
  ];

  const handleShare = (platform: string) => {
    console.log(`Sharing to ${platform}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0fdf4_1px,transparent_1px),linear-gradient(to_bottom,#f0fdf4_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4"
          >
            Our Blog
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
            Stories from the{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Pitch
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Insights, updates, and inspiration from the world of grassroots
            football
          </p>
        </motion.div>

        {!selectedPost ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedPost(post)}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {post.author.name}
                          </p>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ x: 5 }}
                        className="text-emerald-600 font-semibold text-sm flex items-center gap-1"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => setSelectedPost(null)}
              className="flex items-center gap-2 text-emerald-600 font-semibold mb-8 hover:text-emerald-700 transition-colors"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Back to all posts
            </motion.button>

            <article className="bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-lg">
              <div className="relative h-96">
                <Image
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="inline-block px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full mb-4">
                    {selectedPost.category}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                    {selectedPost.title}
                  </h1>
                  <div className="flex items-center gap-6 text-white/90">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {selectedPost.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {selectedPost.readTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {selectedPost.author.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedPost.author.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setLiked(!liked)}
                      className={`p-2 rounded-lg transition-colors ${
                        liked
                          ? "bg-red-50 text-red-500"
                          : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className="w-5 h-5"
                        fill={liked ? "currentColor" : "none"}
                      />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setBookmarked(!bookmarked)}
                      className={`p-2 rounded-lg transition-colors ${
                        bookmarked
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                      }`}
                    >
                      <Bookmark
                        className="w-5 h-5"
                        fill={bookmarked ? "currentColor" : "none"}
                      />
                    </motion.button>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none mb-12">
                  {selectedPost.content.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-gray-700 leading-relaxed mb-6"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-emerald-50 text-emerald-700 font-medium rounded-lg"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="pt-8 border-t border-gray-100">
                  <p className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share this post
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShare("twitter")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShare("facebook")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShare("linkedin")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopyLink}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Link2 className="w-4 h-4" />
                          Copy Link
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </article>
          </motion.div>
        )}
      </div>
    </div>
  );
}
