import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft, Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Ambient colour */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-blue/25 blur-3xl animate-blob" />
        <div
          className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-brand-pink/25 blur-3xl animate-blob"
          style={{ animationDelay: '-8s' }}
        />
        <div
          className="absolute left-1/3 top-1/2 h-80 w-80 rounded-full bg-brand-violet/20 blur-3xl animate-blob"
          style={{ animationDelay: '-14s' }}
        />
      </div>

      <div className="relative max-w-lg animate-fade-up text-center">
        {/* Big gradient 404 */}
        <h1 className="mb-2 bg-ink-gradient bg-clip-text text-[8rem] font-extrabold leading-none tracking-tighter text-transparent md:text-[11rem]">
          404
        </h1>

        <div className="mb-6 flex justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-gradient text-ink shadow-lift animate-float">
            <Compass className="h-8 w-8" />
          </span>
        </div>

        <h2 className="mb-3 text-3xl font-extrabold tracking-tight">
          Oops! Page{' '}
          <span className="text-gold-ink">not found</span>
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          The page you're looking for doesn't exist or has moved somewhere else.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="gradient" size="lg" asChild>
            <Link to="/">
              <Home className="h-5 w-5" />
              Return to Home
            </Link>
          </Button>
          <Button variant="outline-gradient" size="lg" asChild>
            <Link to="/products">
              <Search className="h-5 w-5" />
              Browse Products
            </Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand-violet"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Go back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
