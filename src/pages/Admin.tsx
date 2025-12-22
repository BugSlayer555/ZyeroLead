import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, RefreshCw, AlertCircle } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Booking {
    date: string;
    time: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    details: string;
}

export default function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null); // Stores 'date|time' of deleting item
    const { toast } = useToast();

    // REPLACE THIS WITH YOUR DEPLOYED GOOGLE APPS SCRIPT URL
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxfoanV0ZAhs8esVGtci22cMRlCuY2DvYiVrPg7DbV14lnyhXs8pIed3DYEkCY_U15hNw/exec";

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "admin123") {
            setIsAuthenticated(true);
            fetchBookings();
        } else {
            toast({
                title: "Invalid Password",
                variant: "destructive",
            });
        }
    };

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            // Need to add action=getAll to your GAS script
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getAll`);

            if (!response.ok) {
                const text = await response.text();
                console.error("API Error:", text);
                throw new Error(`API responded with status: ${response.status}`);
            }

            const data = await response.json();
            if (data.bookings && Array.isArray(data.bookings)) {
                setBookings(data.bookings);
            } else {
                console.warn("Unexpected API response:", data);
                if (data.error) {
                    toast({
                        title: "Backend Error",
                        description: data.error,
                        variant: "destructive"
                    });
                }
            }
        } catch (error) {
            console.error("Failed to fetch bookings", error);
            toast({
                title: "Failed to fetch bookings",
                description: "Check console for details. Ensure Script is deployed as 'Anyone'.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async (booking: Booking) => {
        if (!window.confirm(`Are you sure you want to cancel the booking for ${booking.name}?`)) return;

        const id = `${booking.date}|${booking.time}`;
        setIsDeleting(id);

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain",
                },
                body: JSON.stringify({
                    action: "cancel",
                    date: booking.date,
                    time: booking.time,
                    email: booking.email // Optional verification
                }),
            });

            // Optimistic update since no-cors doesn't give feedback
            setBookings(prev => prev.filter(b => `${b.date}|${b.time}` !== id));

            toast({
                title: "Booking Cancelled",
                description: "The slot should now be open.",
            });

        } catch (error) {
            console.error("Failed to cancel", error);
            toast({
                title: "Cancellation Failed",
                variant: "destructive"
            });
        } finally {
            setIsDeleting(null);
        }
    };

    if (!isAuthenticated) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex items-center justify-center pt-24">
                    <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 bg-card p-8 rounded-xl border shadow-sm">
                        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
                        <Input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 pt-32 pb-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Booking Management</h1>
                    <Button onClick={fetchBookings} variant="outline" disabled={isLoading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>

                <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.length === 0 && !isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                        No bookings found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                bookings.map((booking, idx) => {
                                    const id = `${booking.date}|${booking.time}`;
                                    return (
                                        <TableRow key={idx}>
                                            <TableCell className="font-medium">
                                                {booking.date} <br />
                                                <span className="text-muted-foreground text-sm">{booking.time}</span>
                                            </TableCell>
                                            <TableCell>{booking.name}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-sm">
                                                    <span>{booking.email}</span>
                                                    <span className="text-muted-foreground">{booking.phone}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-[200px] truncate" title={booking.company}>
                                                    {booking.company || "-"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={isDeleting === id}
                                                    onClick={() => handleCancel(booking)}
                                                >
                                                    {isDeleting === id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Cancel
                                                        </>
                                                    )}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-8 p-4 bg-muted/50 rounded-lg flex items-start gap-3 text-sm text-foreground/70">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <p>
                        <strong>Note:</strong> Cancelling a booking here will remove the row from the Google Sheet (or mark it cancelled), freeing up the slot immediately on the calendar.
                    </p>
                </div>
            </div>
        </Layout>
    );
}
