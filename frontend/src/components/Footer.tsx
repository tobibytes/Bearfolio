export const Footer = () => {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 font-semibold text-ink">
          <span className="h-2 w-2 rounded-full bg-gradient-to-r from-brand to-sky-500" />
          Bearfolio
        </div>
        <div className="flex flex-wrap gap-4">
          <span>Built for every major</span>
          <span>·</span>
          <span>© 2025 Bearfolio</span>
        </div>
      </div>
    </footer>
  );
};
