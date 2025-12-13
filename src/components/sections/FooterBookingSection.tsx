import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
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

export function FooterBookingSection() {
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
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto glass-card p-8 md:p-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">

                        {/* Left Content */}
                        <div className="space-y-6">
                            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                                Schedule a Meeting
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black">
                                Ready to <span className="text-gradient">Scale?</span>
                            </h2>
                            <p className="text-foreground/60 text-lg leading-relaxed">
                                Book a free 15-minute strategy call. We'll discuss your current
                                challenges and show you exactly how we can help you acquire verified
                                buyer leads.
                            </p>

                            <div className="space-y-4 pt-4">
                                {[
                                    "No commitment required",
                                    "Get actionable insights",
                                    "See real case studies",
                                    "Custom strategy for your location",
                                ].map((benefit) => (
                                    <div key={benefit} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                        <span className="text-foreground/80">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Content - Calendar */}
                        <div className="space-y-6 bg-background rounded-2xl p-6 border border-border/50 shadow-sm">
                            <div className="text-center mb-4">
                                <h3 className="font-semibold text-lg">Select a Date & Time</h3>
                                <p className="text-sm text-foreground/50">
                                    Times are in local timezone
                                </p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8 justify-center">
                                <div className="mx-auto">
                                    <Calendar
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
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
