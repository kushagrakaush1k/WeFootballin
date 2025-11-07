"use client";

import { motion } from "framer-motion";
import { Calendar, TrendingUp, Users, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Calendar,
    title: "Find Games",
    description:
      "Discover football games in your area. Filter by skill level, location, and time.",
  },
  {
    icon: TrendingUp,
    title: "Track Stats",
    description:
      "Monitor your goals, assists, and performance. Watch your rating improve over time.",
  },
  {
    icon: Users,
    title: "Build Community",
    description:
      "Connect with players, form teams, and create lasting friendships on the pitch.",
  },
  {
    icon: Trophy,
    title: "Compete & Win",
    description:
      "Join tournaments, climb leaderboards, and prove yourself as the best.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-muted-foreground">
            Built for footballers, by footballers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className="p-6 h-full hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border-2 hover:border-primary/50 group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
