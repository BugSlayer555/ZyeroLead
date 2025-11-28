import { useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Director, Skyline Developers",
    image: "RK",
    content:
      "Zyero Lead delivered 42 verified buyer leads in just 14 days. Our sales team couldn't believe the quality. Every lead was genuinely interested in our 3BHK apartments.",
    result: "42 leads in 14 days",
  },
  {
    name: "Priya Sharma",
    role: "Marketing Head, HomeLand Realty",
    image: "PS",
    content:
      "We've tried multiple lead gen agencies before. Zyero Lead is different — their verification process is unmatched. 31% of leads converted into site visits.",
    result: "31% conversion rate",
  },
  {
    name: "Amit Patel",
    role: "CEO, Patel Properties",
    image: "AP",
    content:
      "The ROI has been incredible. At ₹35 CPL for verified plot buyers, we've scaled our campaigns 3x without sacrificing quality. Highly recommend!",
    result: "₹35 CPL achieved",
  },
  {
    name: "Sneha Reddy",
    role: "Sales Manager, Urban Homes",
    image: "SR",
    content:
      "What sets Zyero Lead apart is their appointment booking service. Our team now only meets pre-qualified buyers. Time savings alone is worth the investment.",
    result: "50% time saved",
  },
  {
    name: "Vikram Singh",
    role: "Founder, VK Builders",
    image: "VS",
    content:
      "From our first campaign, we received leads that actually responded. The CRM integration made our workflow seamless. Best decision for our business growth.",
    result: "3x pipeline growth",
  },
];

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += 0.5;
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section className="py-24 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mt-4 mb-6">
            Trusted by{" "}
            <span className="text-gradient">500+ Real Estate Leaders</span>
          </h2>
          <p className="text-lg text-foreground/60">
            Don't just take our word for it. Here's what our clients say about
            working with Zyero Lead.
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-hidden cursor-grab"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[400px] glass-card p-6"
          >
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-primary text-primary"
                />
              ))}
            </div>

            <Quote className="w-10 h-10 text-primary/20 mb-4" />

            <p className="text-foreground/70 mb-6 leading-relaxed">
              "{testimonial.content}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  {testimonial.image}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-foreground/50">{testimonial.role}</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-green-500/10 text-green-600 text-xs font-semibold rounded-full">
                {testimonial.result}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
