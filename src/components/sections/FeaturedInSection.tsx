const logos = [
  "Economic Times",
  "Forbes India",
  "YourStory",
  "Inc42",
  "Business Today",
  "Entrepreneur India",
];

export function FeaturedInSection() {
  return (
    <section className="py-16 border-y border-border/50 bg-muted/30">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-foreground/50 font-medium mb-8">
          TRUSTED BY LEADING REAL ESTATE COMPANIES
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {logos.map((logo) => (
            <div
              key={logo}
              className="text-xl md:text-2xl font-bold text-foreground/20 hover:text-foreground/40 transition-colors cursor-default"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
