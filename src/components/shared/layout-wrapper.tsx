"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

const publicPaths = [
  "/",
  "/athletes",
  "/organizers",
  "/brands",
  "/fans",
  "/bettors",
  "/referees",
  "/blog",
];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = publicPaths.includes(pathname) || pathname.startsWith("/blog/");

  if (isPublic) {
    return (
      <>
        <Header />
        <main>{children}</main>
        <Footer />
      </>
    );
  }

  return <>{children}</>;
}
