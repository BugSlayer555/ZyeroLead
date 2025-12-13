import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { CheckCircle, Clock, Users, Shield, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const timeSlots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

const benefits = [
  "Discuss your specific lead acquisition challenges",
  "Get a custom strategy tailored to your projects",
  "See real examples from similar clients",
  "No commitment required just actionable insights",
];

const trustBadges = [
  { icon: Users, label: "50+ Clients Served" },
  { icon: Shield, label: "94% Verification Rate" },
  { icon: Clock, label: "48hr Lead Delivery" },
];

export default function BookCall() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { toast } = useToast();

  const handleBooking = () => {
    if (!date || !selectedTime) {
      toast({
        title: "Please select a date and time",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Booking Request Received!",
      description: `Requested for ${format(date, "MMMM do, yyyy")} at ${selectedTime}. We'll confirm shortly.`,
    });

    // Reset selection
    setSelectedTime(null);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 section-gradient" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Strategy Call
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4 mb-6">
              Book Your{" "}
              <span className="text-gradient">15-Minute Call</span>
            </h1>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
              Get a personalized strategy session with our team. No pitch, no
              pressure just actionable insights for your business.
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

            {/* Right Column - Calendar */}
            <div className="space-y-6 bg-background rounded-2xl p-6 border border-border/50 shadow-sm glass-card">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg">Select a Date & Time</h3>
                <p className="text-sm text-foreground/50">
                  Times are in local timezone
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-8 justify-center">
                <div className="mx-auto">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border shadow-sm p-3"
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                  />
                </div>

                {date && (
                  <div className="space-y-3 min-w-[140px]">
                    <p className="text-sm font-medium text-center md:text-left mb-2">
                      Available Times
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "w-full justify-start text-xs",
                            selectedTime === time && "bg-primary text-primary-foreground"
                          )}
                          onClick={() => setSelectedTime(time)}
                        >
                          <Clock className="w-3 h-3 mr-2" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border mt-4">
                <Button
                  className="w-full"
                  size="lg"
                  disabled={!date || !selectedTime}
                  onClick={handleBooking}
                >
                  Confirm Booking
                </Button>
                {date && selectedTime && (
                  <p className="text-xs text-center text-foreground/50 mt-2">
                    Booking for {format(date, "MMM do")} at {selectedTime}
                  </p>
                )}
              </div>

              {/* Manual Booking Option */}
              <div className="text-center space-y-4 pt-4 border-t border-border">
                <p className="text-sm text-foreground/60">
                  Prefer to book manually?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="ghost" size="sm">
                    <a href="tel:+919876543210">
                      Call Us Directly
                    </a>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
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
