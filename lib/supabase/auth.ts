// ========================================
// FILE: lib/supabase/auth.ts
// Authentication helper functions
// ========================================

import { createClient as createBrowserClient } from './client';
import { createClient as createServerClient } from './server';

export async function getCurrentUser() {
  const supabase = createBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentUserServer() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserRole(userId: string) {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
  return data?.role || 'player';
}

export async function signOut() {
  const supabase = createBrowserClient();
  await supabase.auth.signOut();
}

// ========================================
// FILE: lib/utils/teamUtils.ts
// Team-related utility functions
// ========================================

import { Team } from '@/lib/supabase/database.types';

export function calculatePosition(teams: Team[]): Team[] {
  return teams
    .sort((a, b) => {
      // Sort by points (descending)
      if (b.points !== a.points) return b.points - a.points;
      // Then by goal difference (descending)
      if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
      // Then by goals for (descending)
      return b.goals_for - a.goals_for;
    });
}

export function getTeamQualification(position: number): 'main_cup' | 'shield_cup' | 'none' {
  if (position <= 2) return 'main_cup';
  if (position >= 3) return 'shield_cup';
  return 'none';
}

export function getLeagueColor(league: string): string {
  const colors = {
    A: 'from-blue-500 to-blue-700',
    B: 'from-green-500 to-green-700',
    C: 'from-purple-500 to-purple-700',
  };
  return colors[league as keyof typeof colors] || 'from-gray-500 to-gray-700';
}

// ========================================
// FILE: lib/utils/dateUtils.ts
// Date formatting utilities
// ========================================

import { format, formatDistanceToNow } from 'date-fns';

export function formatMatchDate(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy • hh:mm a');
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isUpcoming(date: string | Date): boolean {
  return new Date(date) > new Date();
}

// ========================================
// FILE: components/ui/input.tsx
// (If you don't have it already from shadcn)
// ========================================

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

// ========================================
// FILE: components/layout/Navbar.tsx
// Updated Navbar with Auth
// ========================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { Menu, X, Trophy, User as UserIcon, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('player');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data) setUserRole(data.role);
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary" />
            <span className="text-2xl font-black">
              <span className="text-primary">We</span>
              <span>Footballin'</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/leaderboard" className="text-sm font-medium hover:text-primary transition">
              Leaderboard
            </Link>
            
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition">
                  Dashboard
                </Link>
                {userRole === 'admin' && (
                  <Link href="/admin" className="text-sm font-medium hover:text-primary transition">
                    Admin
                  </Link>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                      <Avatar>
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center cursor-pointer">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button className="football-gradient">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/leaderboard"
              className="block py-2 text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Leaderboard
            </Link>
            
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block py-2 text-sm font-medium hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {userRole === 'admin' && (
                  <Link
                    href="/admin"
                    className="block py-2 text-sm font-medium hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="block py-2 text-sm font-medium hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-sm font-medium hover:text-primary"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">Sign In</Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full football-gradient">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// ========================================
// FILE: app/layout.tsx
// Updated root layout with Navbar
// ========================================

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WeFootballin - ROCK8 League',
  description: 'Join the ultimate football league - 3 Lakh Prize Pool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Navbar />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

// ========================================
// FILE: app/page.tsx  
// Updated landing page
// ========================================

import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ScrollSection from '@/components/home/ScrollSection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <ScrollSection />
    </main>
  );
}