import { useState, useEffect, useRef } from "react";
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
import { CheckCircle, Clock, Loader2, ArrowLeft, ArrowRight, Calendar as CalendarIcon } from "lucide-react";
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

export default function BookCalendar() {
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

    const sessionBookedSlots = useRef<Record<string, string[]>>({});

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxfoanV0ZAhs8esVGtci22cMRlCuY2DvYiVrPg7DbV14lnyhXs8pIed3DYEkCY_U15hNw/exec";

    useEffect(() => {
        if (date) {
            const fetchBookings = async () => {
                setIsLoadingSlots(true);
                setBookedSlots([]);

                const dateStr = format(date, "yyyy-MM-dd");
                const localForDate = sessionBookedSlots.current[dateStr] || [];
                setBookedSlots([...localForDate]);

                try {
                    // Cache busting with timestamp
                    const response = await fetch(`${GOOGLE_SCRIPT_URL}?date=${dateStr}&_=${Date.now()}`);
                    if (!response.ok) throw new Error("Network error while checking slots");
                    const data = await response.json();

                    if (data.bookedTimes && Array.isArray(data.bookedTimes)) {
                        console.log(`Live Sync (${dateStr}): Blocks found:`, data.bookedTimes);
                        // Prefer server data, only merge session local data for the current date
                        const localForDate = sessionBookedSlots.current[dateStr] || [];
                        const combined = Array.from(new Set([...localForDate, ...data.bookedTimes]));
                        setBookedSlots(combined);
                    }
                } catch (error) {
                    console.error("Failed to fetch slots", error);
                    toast({
                        title: "Availability Sync Error",
                        description: "Could not fetch current availability. Please refresh.",
                        variant: "destructive"
                    });
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
            const fullDetails = `Role: ${formData.clientType} | Ads: ${formData.marketingStatus} | Budget: ${formData.budget}`;
            const enhancedCompany = formData.company ? `${formData.company} | ${fullDetails}` : fullDetails;

            const payload = {
                ...formData,
                company: enhancedCompany,
                description: fullDetails,
                date: date ? format(date, "yyyy-MM-dd") : "",
                time: selectedTime,
                created_at: new Date().toISOString()
            };

            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "text/plain",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.status === "error") {
                throw new Error(data.message || "Unknown backend error");
            }

            setIsSubmitting(false);
            setIsSuccess(true);

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
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-card rounded-3xl p-8 border border-border shadow-2xl animate-fade-up">
                <div className="flex flex-col lg:flex-row gap-12 justify-center items-stretch">
                    <div className="flex-1 flex justify-center items-center p-4 bg-muted/30 rounded-2xl border border-border/50">
                        <div className="transform scale-110 origin-center">
                            <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-xl"
                                disabled={(date) => date < new Date() || date < new Date("1900-01-01") || date.getDay() === 0 || date.getDay() === 6}
                            />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-[300px] space-y-6">
                        {date ? (
                            <>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-bold">
                                            {format(date, "EEEE, MMM do")}
                                        </p>
                                        <div className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                                            Availability
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 min-h-[200px] content-start">
                                        {isLoadingSlots ? (
                                            <div className="col-span-2 text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                                                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                                                <p className="text-sm">Syncing Live Slots...</p>
                                            </div>
                                        ) : (
                                            <>
                                                {timeSlots.map((time) => {
                                                    const normalizeTime = (t: string) => t.trim().toLowerCase().replace(/^0/, '').replace(/\s+/g, '');
                                                    const isTaken = bookedSlots.some(s => normalizeTime(s) === normalizeTime(time));

                                                    // HIDE THE SLOT IF IT IS TAKEN (at user's request)
                                                    if (isTaken) return null;

                                                    return (
                                                        <Button
                                                            key={time}
                                                            variant={selectedTime === time ? "default" : "outline"}
                                                            size="lg"
                                                            className={cn(
                                                                "w-full justify-start font-bold transition-all duration-300 h-12",
                                                                selectedTime === time && "ring-2 ring-primary ring-offset-2 scale-105"
                                                            )}
                                                            onClick={() => setSelectedTime(time)}
                                                        >
                                                            <Clock className={cn("w-4 h-4 mr-2", selectedTime === time ? "text-primary-foreground" : "text-primary")} />
                                                            {time}
                                                        </Button>
                                                    );
                                                })}
                                                {timeSlots.every(t => bookedSlots.some(s => t.trim().toLowerCase().replace(/^0/, '').replace(/\s+/g, '') === s.trim().toLowerCase().replace(/^0/, '').replace(/\s+/g, ''))) && (
                                                    <div className="col-span-2 text-center py-8 text-muted-foreground bg-orange-50/50 rounded-xl border border-orange-100">
                                                        <p className="font-bold text-orange-600">No Slots Available</p>
                                                        <p className="text-xs">All timings are currently blocked or booked.</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                                    disabled={!selectedTime}
                                    onClick={handleBookingClick}
                                >
                                    Book Now
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center p-12 border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
                                <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                                <p className="font-semibold">Select a date</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={(open) => !isSuccess && setIsDialogOpen(open)}>
                <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                    <div className="h-2 bg-primary" />
                    <div className="p-8">
                        <DialogHeader className="mb-8">
                            <DialogTitle className="text-2xl font-black">
                                {isSuccess ? "Confirmed!" : "Your Details"}
                            </DialogTitle>
                            <DialogDescription className="text-base pt-2">
                                {isSuccess
                                    ? "Invitation sent to your email."
                                    : (
                                        <>
                                            {step === 1 ? (
                                                <>
                                                    Booking for{" "}
                                                    {date && selectedTime && (
                                                        <span className="font-bold text-primary block mt-1">
                                                            {format(date, "MMMM do")} @ {selectedTime}
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                "Almost done!"
                                            )}
                                        </>
                                    )
                                }
                            </DialogDescription>
                        </DialogHeader>

                        {!isSuccess ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {step === 1 && (
                                    <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Name *</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                required
                                                className="h-12"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Phone *</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                required
                                                type="tel"
                                                className="h-12"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+91..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email *</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                required
                                                type="email"
                                                className="h-12"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            className="w-full h-12 font-bold"
                                            onClick={handleNextStep}
                                        >
                                            Continue
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Role</Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setFormData((prev) => ({ ...prev, clientType: value }))
                                                }
                                            >
                                                <SelectTrigger className="h-12">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Builder / Developer">Builder / Developer</SelectItem>
                                                    <SelectItem value="Real Estate Agent">Real Estate Agent</SelectItem>
                                                    <SelectItem value="Sales Team">Sales Team</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Budget</Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setFormData((prev) => ({ ...prev, budget: value }))
                                                }
                                            >
                                                <SelectTrigger className="h-12">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="< 50k">&lt; 50k</SelectItem>
                                                    <SelectItem value="50k - 1L">50k - 1L</SelectItem>
                                                    <SelectItem value="> 1L">&gt; 1L</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex-1 h-12"
                                                disabled={isSubmitting}
                                                onClick={() => setStep(1)}
                                            >
                                                Back
                                            </Button>
                                            <Button type="submit" className="flex-[2] h-12 font-bold" disabled={isSubmitting}>
                                                {isSubmitting ? "Processing..." : "Confirm Booking"}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        ) : (
                            <div className="text-center py-12 space-y-6">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                                <h3 className="text-xl font-bold">Successfully Booked!</h3>
                                <Button onClick={handleClose} size="lg" className="w-full h-12 font-bold mt-4">
                                    Done
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
