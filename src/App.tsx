import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { ComponentExample } from "@/components/component-example";
import Demo from "@/pages/Demo";
import ZenNotes from "@/pages/ZenNotes";
import CardDeck from "@/pages/CardDeck";
import TimelineNotes from "@/pages/TimelineNotes";

function Nav() {
  const location = useLocation();
  const links = [
    { to: "/", label: "Home" },
    { to: "/demo", label: "Demo" },
    { to: "/zen-notes", label: "Zen Notes" },
    { to: "/card-deck", label: "Card Deck" },
    { to: "/timeline", label: "Timeline" },
  ];

  // Hide nav on zen-notes since it uses full-screen layout
  if (["/zen-notes", "/card-deck", "/timeline"].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="flex items-center gap-4 border-b border-neutral-200 bg-white px-6 py-3 dark:border-neutral-800 dark:bg-neutral-950">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            location.pathname === link.to
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<ComponentExample />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/zen-notes" element={<ZenNotes />} />
        <Route path="/card-deck" element={<CardDeck />} />
        <Route path="/timeline" element={<TimelineNotes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

