import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    description: "Perfect for individual realtors and small teams",
    price: "₹25,000",
    period: "/month",
    features: [
      "Up to 50 verified leads/month",
      "Basic lead verification",
      "Email delivery",
      "WhatsApp support",
      "Monthly reporting",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Growth",
    description: "Ideal for growing real estate businesses",
    price: "₹75,000",
    period: "/month",
    features: [
      "Up to 200 verified leads/month",
      "AI + Human verification",
      "CRM integration",
      "Appointment booking",
      "Dedicated account manager",
      "Weekly reporting & calls",
      "Custom targeting criteria",
    ],
    cta: "Start Growing",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large builders and developers",
    price: "Custom",
    period: "",
    features: [
      "Unlimited verified leads",
      "Multi-city campaigns",
      "White-label dashboards",
      "API access",
      "24/7 priority support",
      "Custom funnel building",
      "On-site team training",
      "Quarterly business reviews",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mt-4 mb-6">
            Simple, Transparent{" "}
            <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-lg text-foreground/60">
            Choose a plan that fits your business needs. All plans include
            our core verification technology.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl p-8 transition-all duration-300",
                plan.popular
                  ? "bg-foreground text-background scale-105 shadow-2xl"
                  : "glass-card hover-lift"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                    <Sparkles className="w-4 h-4" />
                    Recommended
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p
                  className={cn(
                    "text-sm",
                    plan.popular ? "text-background/60" : "text-foreground/60"
                  )}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-black">{plan.price}</span>
                <span
                  className={cn(
                    "text-sm",
                    plan.popular ? "text-background/60" : "text-foreground/60"
                  )}
                >
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={cn(
                        "w-5 h-5 shrink-0 mt-0.5",
                        plan.popular ? "text-primary" : "text-primary"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        plan.popular ? "text-background/80" : "text-foreground/70"
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.popular ? "hero" : "outline"}
                size="lg"
                className="w-full"
              >
                <Link to="/book-call">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
