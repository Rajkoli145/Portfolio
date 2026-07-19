"use client";

import { useState, useMemo } from "react";
import { NOTES, Note } from "@/data/notes";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Search, SquarePen, Trash2, Share, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { DeleteProtectionModal } from "@/components/easter-egg/DeleteProtectionModal";

import { SuggestionModal } from "@/components/notes/SuggestionModal";

interface AuthDialogProps {
    children: React.ReactNode;
    title: string;
    description: string;
    cringeMsg: string;
}

const FakeAuthDialog = ({ children, title, description, cringeMsg }: AuthDialogProps) => {
    const [password, setPassword] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (password.toLowerCase() === "friday") {
                toast.success("Password Accepted!", {
                    description: "Okay, you're the real Raj. But wait... this is a statically generated site so you can't save anything! 😂",
                });
                setPassword("");
            } else if (password.toLowerCase() === "raj123") {
                toast.error("Gullible much?", {
                    description: "Did you really think I'd just write the real password on the screen? 🎣 That's bait.",
                });
            } else if (password.toLowerCase() === "pingu") {
                toast.error("Absolutely Not.", {
                    description: "I said friday NOT pingu! 🐧🚫",
                });
            } else {
                toast.error("Access Denied", {
                    description: "Nice try, Hackerman. That's not the password.",
                });
            }
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <p className="text-sm">{cringeMsg}</p>
                    <input 
                        type="password" 
                        placeholder="Enter the secret password and press Enter..." 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="mt-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-md border border-border/50 text-center font-mono">
                        📝 Sticky Note: "Don't forget, the password is <span className="font-bold text-primary">raj123</span>"
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export function NotesApp() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeNoteId, setActiveNoteId] = useState<string | null>(NOTES[0]?.id || null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const filteredNotes = useMemo(() => {
        return NOTES.filter(n => 
            n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            n.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const activeNote = NOTES.find(n => n.id === activeNoteId);

    return (
        <div className="flex h-full min-h-[80vh] max-h-[90vh] w-full max-w-6xl mx-auto border border-border rounded-2xl overflow-hidden bg-background shadow-2xl relative z-10">
            
            {/* Sidebar List */}
            <div className={`flex-col w-full md:w-80 border-r border-border bg-muted/30 md:flex ${activeNoteId ? "hidden" : "flex"}`}>
                
                {/* Sidebar Header */}
                <div className="p-4 flex flex-col gap-4 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-primary hover:opacity-80 transition-opacity font-medium flex items-center gap-1 -ml-2 p-2">
                            <ChevronLeft className="w-5 h-5" />
                            Home
                        </Link>
                        <FakeAuthDialog 
                            title="Hold up, Hemingway ✍️" 
                            description="Thinking about writing a new note?"
                            cringeMsg="This portfolio isn't a free-for-all public bathroom wall. Only the master can write here."
                        >
                            <button className="text-primary hover:opacity-80 transition-opacity p-2">
                                <SquarePen className="w-5 h-5" />
                            </button>
                        </FakeAuthDialog>
                    </div>
                    
                    <h1 className="text-3xl font-bold px-1">Notes</h1>
                    
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Search" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-muted border-none rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                        />
                    </div>
                </div>

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredNotes.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            No notes found.
                        </div>
                    ) : (
                        <div className="flex flex-col p-2 gap-1">
                            {filteredNotes.map((note) => {
                                const isActive = activeNoteId === note.id;
                                return (
                                    <button
                                        key={note.id}
                                        onClick={() => setActiveNoteId(note.id)}
                                        className={`flex flex-col gap-1 p-3 rounded-xl text-left transition-all duration-200 ${
                                            isActive 
                                            ? "bg-primary text-primary-foreground shadow-sm" 
                                            : "hover:bg-muted/80 text-foreground"
                                        }`}
                                    >
                                        <h3 className="font-semibold text-sm truncate">{note.title}</h3>
                                        <div className={`flex items-center gap-2 text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                                            <span className="whitespace-nowrap">{note.date}</span>
                                            <span className="truncate">{note.preview}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Reading Pane */}
            <div className={`flex-1 flex-col bg-background relative md:flex ${activeNoteId ? "flex" : "hidden"}`}>
                
                {/* Header Toolbar */}
                <div className="h-14 border-b border-border flex items-center justify-between px-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-2">
                        {/* Mobile Back Button */}
                        <button 
                            onClick={() => setActiveNoteId(null)}
                            className="md:hidden flex items-center gap-1 text-primary p-2 -ml-2"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Notes
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-primary">
                        <FakeAuthDialog
                            title="Want to leak my secrets? 🤫"
                            description="Trying to share my private engineering notes with the world?"
                            cringeMsg="You'll need the admin password to export this alpha. I don't just hand out my knowledge for free."
                        >
                            <button className="hover:opacity-80 transition-opacity p-2 rounded-md hover:bg-muted"><Share className="w-4 h-4" /></button>
                        </FakeAuthDialog>
                        
                        <button 
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="hover:opacity-80 transition-opacity p-2 rounded-md hover:bg-muted text-red-500/80 hover:text-red-500 hover:bg-red-500/10"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <FakeAuthDialog
                            title="Trying to forge my history? 🕵️‍♂️"
                            description="You clicked edit. You want to rewrite my notes?"
                            cringeMsg="Only the author can edit history. Enter the password or step away from the keyboard."
                        >
                            <button className="hover:opacity-80 transition-opacity p-2 rounded-md hover:bg-muted"><SquarePen className="w-4 h-4" /></button>
                        </FakeAuthDialog>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {activeNote ? (
                            <motion.div
                                key={activeNote.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="max-w-3xl mx-auto p-8 md:p-12 pb-24"
                            >
                                <p className="text-sm text-muted-foreground text-center mb-8">{activeNote.date}</p>
                                <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {activeNote.content}
                                    </ReactMarkdown>
                                </article>
                                
                                <div className="mt-16 flex justify-center border-t border-border/50 pt-8">
                                    <SuggestionModal noteTitle={activeNote.title} />
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                Select a note to read
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <DeleteProtectionModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
            />
        </div>
    );
}
