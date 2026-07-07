export default function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p className="font-display font-semibold text-foreground mb-1">#politicamentecuriosos</p>
        <p>Uma plataforma dedicada a projetos independentes de educação cívica.</p>
        <a href="https://github.com/loukach/politicamentecuriosos" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 hover:text-foreground transition-colors">
          GitHub
        </a>
      </div>
    </footer>
  );
}
