"use client";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = (event: React.MouseEvent) => {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";

    const x = event.clientX;
    const y = event.clientY;

    const circle = document.createElement("div");
    circle.style.position = "fixed";
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.width = "0px";
    circle.style.height = "0px";
    circle.style.borderRadius = "50%";
    circle.style.backgroundColor = isDark ? "#ffffff" : "#0a0a0a";
    circle.style.transform = "translate(-50%, -50%)";
    circle.style.zIndex = "99999";
    circle.style.transition = "width 0.6s cubic-bezier(0.22, 1, 0.36, 1), height 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease-out";
    circle.style.pointerEvents = "none";
    document.body.appendChild(circle);

    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    requestAnimationFrame(() => {
      circle.style.width = `${endRadius * 2}px`;
      circle.style.height = `${endRadius * 2}px`;
    });

    setTimeout(() => {
      setTheme(nextTheme);
      circle.style.opacity = "0";
      setTimeout(() => {
        circle.remove();
      }, 400);
    }, 400);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("relative overflow-hidden", className)}
      onClick={toggleTheme}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
