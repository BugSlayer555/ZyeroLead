import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle, Clock, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
];

export default function CalendarCall() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [step, setStep] = useState(1);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        clientType: "",
        marketingStatus: "",
        budget: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBookingClick = () => {
        if (!date || !selectedTime) {
            toast({
                title: "Please select a date and time",
                variant: "destructive",
            });
            return;
        }
        setIsDialogOpen(true);
    };

    const handleNextStep = () => {
        if (!formData.name || !formData.phone || !formData.email) {
            toast({
                title: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }
        setStep(2);
    };

    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Store user's session bookings locally to prevent "disappearing" on nav
    // format: "yyyy-MM-dd": ["10:00 AM", "11:00 AM"]
    const sessionBookedSlots = useRef<Record<string, string[]>>({});

    // REPLACE THIS WITH YOUR DEPLOYED GOOGLE APPS SCRIPT URL
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxfoanV0ZAhs8esVGtci22cMRlCuY2DvYiVrPg7DbV14lnyhXs8pIed3DYEkCY_U15hNw/exec";

    useEffect(() => {
        if (date) {
            const fetchBookings = async () => {
                setIsLoadingSlots(true);
                setBookedSlots([]); // Reset to strict empty initially

                const dateStr = format(date, "yyyy-MM-dd");

                // 1. Get local persistent bookings for this date (optimistic)
                const localForDate = sessionBookedSlots.current[dateStr] || [];
                setBookedSlots([...localForDate]);

                try {
                    console.log("Fetching slots for:", dateStr); // DEBUG
                    const response = await fetch(`${GOOGLE_SCRIPT_URL}?date=${dateStr}`);
                    const data = await response.json();

                    console.log("Backend returned:", data); // DEBUG

                    if (data.bookedTimes && Array.isArray(data.bookedTimes)) {
                        // Merge server data with local data unique set
                        setBookedSlots(prev => Array.from(new Set([...prev, ...data.bookedTimes])));
                    }
                } catch (error) {
                    console.error("Failed to fetch slots", error);
                } finally {
                    setIsLoadingSlots(false);
                }
            };
            fetchBookings();
        }
    }, [date]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Format the data for the backend
            // Pack extra details into company field (or description) to ensure it appears on calendar
            // since the backend script likely only listens to specific fields.
            const fullDetails = `Role: ${formData.clientType} | Ads: ${formData.marketingStatus} | Budget: ${formData.budget}`;
            const enhancedCompany = formData.company ? `${formData.company} | ${fullDetails}` : fullDetails;

            const payload = {
                ...formData,
                company: enhancedCompany, // Sending combined info in company field
                description: fullDetails, // Sending in description as backup
                date: date ? format(date, "yyyy-MM-dd") : "",
                time: selectedTime,
                created_at: new Date().toISOString()
            };

            // 2. Send to Google Apps Script
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "cors", // Changed to CORS to read the error message
                headers: {
                    "Content-Type": "text/plain",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.status === "error") {
                throw new Error(data.message || "Unknown backend error");
            }

            // 3. Handle Success
            setIsSubmitting(false);
            setIsSuccess(true);

            // Optimistically update local state AND session cache
            if (date && selectedTime) {
                const dateStr = format(date, "yyyy-MM-dd");
                const current = sessionBookedSlots.current[dateStr] || [];
                sessionBookedSlots.current[dateStr] = [...current, selectedTime];
                setBookedSlots(prev => [...prev, selectedTime]);
            }

            toast({
                title: "Booking Confirmed!",
                description: "We have added it to our calendar. See you then!",
            });

        } catch (error) {
            console.error("Booking caught error:", error);
            setIsSubmitting(false);
            // Show the ACTUAL error message from Google Script
            toast({
                title: "Submission Error",
                description: error instanceof Error ? error.message : "Please check your script permissions.",
                variant: "destructive",
            });
        }
    };

    const handleClose = () => {
        setIsDialogOpen(false);
        setIsSuccess(false);
        setStep(1);
        setFormData({
            name: "",
            email: "",
            phone: "",
            company: "",
            clientType: "",
            marketingStatus: "",
            budget: ""
        });
        setSelectedTime(null);
    }

    return (
        <Layout>
            <section className="pt-32 pb-12 bg-background min-h-[80vh] flex items-center justify-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-4">10 Verified Buyer Appointments in 3 Months</h1>
                            <p className="text-muted-foreground">Select a date and time that works for you.</p>
                        </div>

                        <div className="bg-card rounded-2xl p-8 border shadow-sm max-w-5xl mx-auto">
                            <div className="flex flex-col md:flex-row gap-12 justify-center items-start">
                                <div className="mx-auto p-4">
                                    <div className="transform scale-110 origin-top">
                                        <CalendarComponent
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            className="rounded-md border shadow-sm p-4"
                                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 w-full md:w-auto min-w-[200px]">
                                    {date && (
                                        <>
                                            <p className="text-sm font-medium text-center md:text-left">
                                                Available Times for {format(date, "MMM do")}
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {isLoadingSlots ? (
                                                    <div className="col-span-2 text-center py-4 text-muted-foreground text-sm">
                                                        <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                                                        Checking availability...
                                                    </div>
                                                ) : timeSlots.map((time) => {
                                                    const isTaken = bookedSlots.includes(time);
                                                    return (
                                                        <Button
                                                            key={time}
                                                            variant={selectedTime === time ? "default" : "outline"}
                                                            size="sm"
                                                            disabled={isTaken}
                                                            className={cn(
                                                                "w-full justify-start text-xs",
                                                                selectedTime === time && "bg-primary text-primary-foreground",
                                                                isTaken && "opacity-50 cursor-not-allowed decoration-slice"
                                                            )}
                                                            onClick={() => !isTaken && setSelectedTime(time)}
                                                        >
                                                            {isTaken ? (
                                                                <span className="text-muted-foreground/60 strike-through line-through flex items-center w-full">
                                                                    {time}
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    <Clock className="w-3 h-3 mr-2" />
                                                                    {time}
                                                                </>
                                                            )}
                                                        </Button>
                                                    );
                                                })}
                                            </div>

                                            <Button
                                                className="w-full mt-4"
                                                disabled={!selectedTime}
                                                onClick={handleBookingClick}
                                            >
                                                Book Call
                                            </Button>
                                        </>
                                    )}

                                    {!date && (
                                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm p-4 border border-dashed rounded-lg">
                                            Select a date to see times
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Dialog open={isDialogOpen} onOpenChange={(open) => !isSuccess && setIsDialogOpen(open)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {isSuccess ? "Booking Confirmed!" : "Finalize Your Booking"}
                        </DialogTitle>
                        <DialogDescription>
                            {isSuccess
                                ? "You're all set. We have sent a calendar invitation to your email address."
                                : (
                                    <>
                                        {step === 1 ? (
                                            <>
                                                Please provide your details so we can confirm your slot for{" "}
                                                {date && selectedTime && (
                                                    <span className="font-semibold text-primary">
                                                        {format(date, "MMM do")} at {selectedTime}
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            "Just a few more details to help us prepare for our call."
                                        )}
                                    </>
                                )
                            }
                        </DialogDescription>
                    </DialogHeader>

                    {!isSuccess ? (
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            {step === 1 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="john@company.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Company Name</Label>
                                        <Input
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            placeholder="Real Estate Corp"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        className="w-full"
                                        onClick={handleNextStep}
                                    >
                                        Next <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-2">
                                        <Label>You are a</Label>
                                        <Select
                                            onValueChange={(value) =>
                                                setFormData((prev) => ({ ...prev, clientType: value }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Builder / Developer">
                                                    Builder / Developer
                                                </SelectItem>
                                                <SelectItem value="Real Estate Agent / Channel Partner">
                                                    Real Estate Agent / Channel Partner
                                                </SelectItem>
                                                <SelectItem value="Property Sales Team">
                                                    Property Sales Team
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Are you currently running ads or marketing?</Label>
                                        <Select
                                            onValueChange={(value) =>
                                                setFormData((prev) => ({ ...prev, marketingStatus: value }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                                <SelectItem value="Planning to start">
                                                    Planning to start
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>What is your budget?</Label>
                                        <Select
                                            onValueChange={(value) =>
                                                setFormData((prev) => ({ ...prev, budget: value }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select budget range" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="< 50k">&lt; 50k</SelectItem>
                                                <SelectItem value="50k - 1L">50k - 1L</SelectItem>
                                                <SelectItem value="1L - 5L">1L - 5L</SelectItem>
                                                <SelectItem value="> 5L">5L &gt;</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            disabled={isSubmitting}
                                            onClick={() => setStep(1)}
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                        </Button>
                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Confirming...
                                                </>
                                            ) : (
                                                "Confirm Booking"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    ) : (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <p className="text-foreground/70">
                                A confirmation email has been sent to <strong>{formData.email}</strong>.
                            </p>
                            <Button onClick={handleClose} className="w-full mt-2">
                                Close
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
