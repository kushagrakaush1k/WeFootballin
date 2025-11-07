import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent mb-4">
              WeFootballin'
            </h3>
            <p className="text-muted-foreground max-w-md">
              Join the ultimate football community. Find games, track your stats, and connect
              with players in your area.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/games"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Find Games
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/games/create"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Host a Game
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} WeFootballin'. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}