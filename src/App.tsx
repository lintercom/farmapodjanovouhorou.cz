import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppDataProvider, useAppData } from "./state/AppDataContext";
import { SiteLayout } from "./layout/SiteLayout";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { ActionsPage } from "./pages/ActionsPage";
import { HorsesPage } from "./pages/HorsesPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { CmsPage } from "./pages/CmsPage";

function ThemeSync() {
  const { data } = useAppData();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", data.settings.primaryColor);
    root.style.setProperty("--secondary", data.settings.secondaryColor);
    root.style.setProperty("--accent", data.settings.accentColor);
    root.style.setProperty("--app-font", data.settings.fontFamily);
    root.dataset.theme = "light";
    root.lang = "cs";
    document.title = data.settings.siteName || "Farma pod Janovou horou";

    const favicon = document.getElementById("dynamic-favicon");
    if (favicon && data.settings.favicon?.trim()) {
      (favicon as HTMLLinkElement).href = data.settings.favicon;
    }
  }, [data.settings]);

  return null;
}

function BodyPageSync() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    const routeToPage: Record<string, string> = {
      "/": "home",
      "/sluzby": "sluzby",
      "/akce": "akce",
      "/nasi-kone": "nasi-kone",
      "/o-nas": "o-nas",
      "/kontakt": "kontakt",
      "/cms": "cms",
    };

    const page = routeToPage[path];
    if (page) {
      document.body.dataset.page = page;
    } else {
      delete document.body.dataset.page;
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const id = location.hash.replace(/^#/, "");
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ block: "start" });
    }
  }, [location.pathname, location.hash]);

  return null;
}

function PrelineInit() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      (window as Window & { HSStaticMethods?: { autoInit: () => void } }).HSStaticMethods?.autoInit();
    }, 0);
    return () => window.clearTimeout(timer);
  });

  return null;
}

export function App() {
  return (
    <AppDataProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ThemeSync />
        <PrelineInit />
        <BodyPageSync />
        <Routes>
          <Route path="/cms" element={<CmsPage />} />
          <Route
            path="/"
            element={<SiteLayout footerVariant="home" />}
          >
            <Route index element={<HomePage />} />
            <Route path="sluzby" element={<ServicesPage />} />
            <Route path="akce" element={<ActionsPage />} />
            <Route path="nasi-kone" element={<HorsesPage />} />
            <Route path="o-nas" element={<AboutPage />} />
            <Route path="kontakt" element={<ContactPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppDataProvider>
  );
}
