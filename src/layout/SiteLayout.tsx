import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface SiteLayoutProps {
  footerVariant?: "home" | "simple";
}

export function SiteLayout({ footerVariant = "simple" }: SiteLayoutProps) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <a className="skip-link" href="#main-content">
        Přeskočit na obsah
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-grow-1">
        <Outlet />
      </main>
      <Footer variant={footerVariant} />
    </div>
  );
}
