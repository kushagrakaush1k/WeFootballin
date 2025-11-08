"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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

      // Public routes
      const publicRoutes = ["/signup", "/signin"];
      const isPublicRoute = publicRoutes.some((route) =>
        pathname?.startsWith(route)
      );

      if (!authenticated && !isPublicRoute) {
        router.push("/signup");
      } else if (authenticated && isPublicRoute) {
        router.push("/");
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
      const publicRoutes = ["/signup", "/signin"];
      const isPublicRoute = publicRoutes.some((route) =>
        pathname?.startsWith(route)
      );

      if (!authenticated && !isPublicRoute) {
        router.push("/signup");
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsLoading(false);
    }
  };

  // Show loading only for protected routes
  const publicRoutes = ["/signup", "/signin"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  if (isLoading && !isPublicRoute) {
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

  // Show navbar only when authenticated and not on public routes
  const showNavbar = isAuthenticated && !isPublicRoute;

  return (
    <html lang="en">
      <body className="min-h-screen bg-black">
        {showNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}
