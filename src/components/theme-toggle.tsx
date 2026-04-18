import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { RiSunFill, RiMoonFill } from "@remixicon/react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "h-8 w-8 rounded-md transition-colors",
        "hover:bg-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <RiMoonFill className="h-4 w-4" />
      ) : (
        <RiSunFill className="h-4 w-4" />
      )}
    </Button>
  );
}
