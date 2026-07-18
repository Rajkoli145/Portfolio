import { NotesApp } from "@/components/notes/notes-app";
import BlurFade from "@/components/magicui/blur-fade";

export default function NotesPage() {
    return (
        <main className="min-h-[100dvh] w-full bg-transparent flex flex-col items-center justify-center p-4 md:p-8 pt-24 pb-24 relative overflow-hidden">
            <BlurFade delay={0.04} className="w-full h-full flex flex-col items-center justify-center max-w-6xl mx-auto flex-1">
                <NotesApp />
            </BlurFade>
        </main>
    );
}
