import { Layout } from "@/components/layout/Layout";
import { PricingSection } from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { CheckCircle } from "lucide-react";

const includedFeatures = [
  "Lead verification (AI + Human)",
  "Real-time lead delivery",
  "Basic CRM support",
  "Email & WhatsApp support",
  "Performance dashboard access",
  "Monthly reporting",
];

export default function Pricing() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 section-gradient" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Pricing
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4 mb-6">
              Simple, Transparent{" "}
              <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
              No hidden fees. No long-term contracts. Pay only for verified
              leads that meet your criteria.
            </p>
          </div>
        </div>
      </section>

      {/* All Plans Include */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-center mb-8">
              All Plans Include
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {includedFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm text-foreground/70">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PricingSection />

      {/* Guarantee */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center glass-card p-12">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-4">
              Our Quality Guarantee
            </h2>
            <p className="text-foreground/60 leading-relaxed mb-6">
              Every lead we deliver goes through our rigorous verification
              process. If a lead turns out to be fake, unreachable after 3
              attempts, or clearly uninterested — we replace it at no extra
              cost. That's our promise.
            </p>
            <p className="text-sm text-foreground/50">
              No questions asked. Simply flag the lead in your dashboard.
            </p>
          </div>
        </div>
      </section>

      <FAQSection />
      <CTASection />
    </Layout>
  );
}
