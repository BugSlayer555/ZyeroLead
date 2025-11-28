import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Users, Shield, Calendar, ArrowRight } from "lucide-react";

const benefits = [
  "Discuss your specific lead acquisition challenges",
  "Get a custom strategy tailored to your projects",
  "See real examples from similar clients",
  "No commitment required — just actionable insights",
];

const trustBadges = [
  { icon: Users, label: "500+ Clients Served" },
  { icon: Shield, label: "94% Verification Rate" },
  { icon: Clock, label: "48hr Lead Delivery" },
];

export default function BookCall() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 section-gradient" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Free Strategy Call
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4 mb-6">
              Book Your{" "}
              <span className="text-gradient">15-Minute Call</span>
            </h1>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
              Get a personalized strategy session with our team. No pitch, no
              pressure — just actionable insights for your business.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-start">
            {/* Left Column - Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  What You'll Get From This Call
                </h2>
                <ul className="space-y-4">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/70">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                {trustBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="text-center p-4 bg-muted/50 rounded-xl"
                  >
                    <badge.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-xs font-medium text-foreground/60">
                      {badge.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="glass-card p-6">
                <p className="text-foreground/70 italic mb-4">
                  "The strategy call alone was worth it. Tej gave us insights
                  that immediately improved our campaigns — even before we
                  signed up."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    R
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Rahul M.</p>
                    <p className="text-xs text-foreground/50">
                      Director, Property Group
                    </p>
                  </div>
                </div>
              </div>

              {/* Process */}
              <div className="p-6 bg-muted/50 rounded-2xl">
                <h3 className="font-semibold mb-4">How It Works</h3>
                <ol className="space-y-3 text-sm text-foreground/70">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      1
                    </span>
                    Book a slot that works for you
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      2
                    </span>
                    Receive a confirmation email with call details
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      3
                    </span>
                    Join the call and get your custom strategy
                  </li>
                </ol>
              </div>
            </div>

            {/* Right Column - Calendar Placeholder */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">Schedule Your Call</h2>
              </div>

              {/* Calendar Placeholder */}
              <div className="border-2 border-dashed border-border rounded-xl p-12 text-center mb-6">
                <Calendar className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                <p className="text-foreground/50 mb-4">
                  Calendar integration would go here
                </p>
                <p className="text-sm text-foreground/40">
                  (Calendly, Cal.com, or custom booking system)
                </p>
              </div>

              {/* Manual Booking Option */}
              <div className="text-center space-y-4">
                <p className="text-sm text-foreground/60">
                  Prefer to book manually?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="hero" size="lg">
                    <a href="tel:+919876543210">
                      Call Us Directly
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp Us
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Mini */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Common Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Is this call really free?",
                  a: "Yes, 100% free with no strings attached. We believe in demonstrating value upfront.",
                },
                {
                  q: "Will I be pressured to sign up?",
                  a: "Absolutely not. This call is about understanding your challenges and providing value. If we're a fit, great. If not, you'll still walk away with actionable insights.",
                },
                {
                  q: "Who will I be speaking with?",
                  a: "You'll speak directly with our founder Tej or a senior strategist who can provide real, personalized advice.",
                },
              ].map((item) => (
                <div key={item.q} className="glass-card p-6">
                  <h3 className="font-semibold mb-2">{item.q}</h3>
                  <p className="text-sm text-foreground/60">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
