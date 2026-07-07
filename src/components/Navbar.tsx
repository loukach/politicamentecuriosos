import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b">
      <div className="container mx-auto flex items-center h-16 px-4">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-primary">
          #politicamentecuriosos
        </Link>
      </div>
    </nav>
  );
}
