import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Lightbulb, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface SuggestionModalProps {
    noteTitle: string;
}

export function SuggestionModal({ noteTitle }: SuggestionModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        suggestion: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.suggestion.trim().length < 5) {
            toast.error("Suggestion too short", { description: "Please enter at least 5 characters." });
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/suggest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    noteTitle,
                    name: formData.name,
                    email: formData.email,
                    suggestion: formData.suggestion
                })
            });

            if (res.ok) {
                setIsSuccess(true);
                toast.success("Suggestion Sent!", { description: "Thanks for helping me improve my notes." });
                
                // Close after a short delay
                setTimeout(() => {
                    setIsOpen(false);
                    // Reset state after it closes
                    setTimeout(() => {
                        setIsSuccess(false);
                        setFormData({ name: "", email: "", suggestion: "" });
                    }, 500);
                }, 2000);
            } else {
                toast.error("Failed to send", { description: "Please try again later." });
            }
        } catch (error) {
            toast.error("Failed to send", { description: "Please try again later." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2.5 mx-auto mt-12 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full border border-border/50 hover:border-primary/30 transition-all">
                    <Lightbulb className="w-4 h-4" />
                    Suggest an Edit / Add a Note
                </button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md border-border bg-background shadow-2xl rounded-2xl overflow-hidden p-0">
                <div className="p-6">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Lightbulb className="w-5 h-5 text-primary" />
                            Have a suggestion?
                        </DialogTitle>
                        <DialogDescription>
                            Spotted a typo? Have a new idea or resource? Send it my way. If it&apos;s good, I&apos;ll add it to the note!
                        </DialogDescription>
                    </DialogHeader>

                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center justify-center py-8 text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 15, delay: 0.1 }}
                                >
                                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                                </motion.div>
                                <h3 className="text-lg font-semibold text-foreground">Message Sent!</h3>
                                <p className="text-sm text-muted-foreground mt-2">Thanks for your contribution.</p>
                            </motion.div>
                        ) : (
                            <motion.form 
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit} 
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-foreground ml-1">Name <span className="text-muted-foreground font-normal">(Optional)</span></label>
                                        <input 
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="John Doe"
                                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-foreground ml-1">Email <span className="text-muted-foreground font-normal">(Optional)</span></label>
                                        <input 
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="john@example.com"
                                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-foreground ml-1">Suggestion <span className="text-red-500">*</span></label>
                                    <textarea 
                                        required
                                        value={formData.suggestion}
                                        onChange={(e) => setFormData(prev => ({ ...prev, suggestion: e.target.value }))}
                                        placeholder={`E.g., In the "${noteTitle}" note, you mentioned...`}
                                        rows={4}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-primary text-primary-foreground font-medium rounded-xl py-2.5 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                                        ) : (
                                            "Send Suggestion"
                                        )}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}
