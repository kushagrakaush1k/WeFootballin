'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: 'Users' | 'Target' | 'Trophy' | 'TrendingUp';
  description?: string;
  index: number;
}

const iconMap = {
  Users: Users,
  Target: Target,
  Trophy: Trophy,
  TrendingUp: TrendingUp,
};

export function StatsCard({ title, value, icon, description, index }: StatsCardProps) {
  const Icon = iconMap[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{value}</div>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
}