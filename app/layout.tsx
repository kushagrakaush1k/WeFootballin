"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const supabase = createClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Quick auth check on mount
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Don't show navbar/footer/whatsapp on auth pages
  const isAuthPage = pathname === "/signin";
  const showNavbar = !isAuthPage;
  const showFooter = !isAuthPage;
  const showWhatsApp = !isAuthPage;

  // Minimal loading state - only show for a split second
  if (isLoading) {
    return (
      <html lang="en">
        <body className="min-h-screen bg-black">
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="min-h-screen bg-black flex flex-col">
        {showNavbar && <Navbar />}
        <main className="flex-1">{children}</main>
        {showFooter && <Footer />}
        <ScrollToTop />

        {/* WhatsApp Float Button - Stick to LEFT, no gap, hide on auth pages */}
        {showWhatsApp && (
          <WhatsAppFloat
            phoneNumber="918448586155"
            message="Hi! I want to join WeFootballin'"
          />
        )}
      </body>
    </html>
  );
}
