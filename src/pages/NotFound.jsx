import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * 404 Page - Shown when a user tries to access a route that doesn't exist.
 */
export default function NotFound() {
  console.log("NotFound component rendered");
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      {/* Big Search Icon to show something is missing */}
      <div className="bg-muted p-6 rounded-full">
        <Search size={64} className="text-muted-foreground" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">404 - Page Not Found</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      {/* Button to take the user back to safety */}
      <Link to="/">
        <Button size="lg" className="rounded-full gap-2">
          <Home size={18} />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
