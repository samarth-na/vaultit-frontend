import { type ReactNode } from "react";
import Navbar from "./Navbar";

type LayoutProps = {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  children: ReactNode;
};

export default function Layout({ user, children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="w-full">{children}</main>
    </div>
  );
}
