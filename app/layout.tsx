"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const authenticated = !!session;
      setIsAuthenticated(authenticated);

      // Public routes that don't need auth
      const publicRoutes = ["/signup", "/signin", "/"];
      const isPublicRoute = publicRoutes.some((route) =>
        pathname?.startsWith(route)
      );

      // Only redirect if trying to access protected routes without auth
      if (!authenticated && !isPublicRoute && pathname !== "/") {
        router.push("/signin");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const authenticated = !!session;
      setIsAuthenticated(authenticated);

      // Public routes
      const publicRoutes = ["/signup", "/signin", "/"];
      const isPublicRoute = publicRoutes.some((route) =>
        pathname?.startsWith(route)
      );

      // Only redirect if trying to access protected routes
      if (!authenticated && !isPublicRoute && pathname !== "/") {
        router.push("/signin");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Auth check error:", error);
      setIsLoading(false);
    }
  };

  // Public routes - show these always
  const publicRoutes = ["/signup", "/signin"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  // Show loading only briefly on initial load
  if (isLoading) {
    return (
      <html lang="en">
        <body className="min-h-screen bg-black">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Show navbar and footer when authenticated OR on home page
  const showNavbar = isAuthenticated || pathname === "/";
  const showFooter = isAuthenticated || pathname === "/";

  return (
    <html lang="en">
      <body className="min-h-screen bg-black flex flex-col">
        {showNavbar && <Navbar />}
        <main className="flex-1">{children}</main>
        {showFooter && <Footer />}
        <ScrollToTop />
      </body>
    </html>
  );
}
