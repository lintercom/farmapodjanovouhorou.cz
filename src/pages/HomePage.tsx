import React from "react";
import { Hero } from "../components/Hero";
import { ServicesSection } from "../components/ServicesSection";
import { HorsesSection } from "../components/HorsesSection";
import { HomeActionsSection } from "../components/HomeActionsSection";
import { useAppData } from "../state/AppDataContext";

export function HomePage() {
  const { data } = useAppData();

  return (
    <>
      <h1 className="visually-hidden">{data.settings.siteName}</h1>
      <Hero hero={data.sections.hero} page="home" />
      <ServicesSection services={data.sections.services} page="home" />
      <HorsesSection horses={data.sections.horses} page="home" />
      <HomeActionsSection gallery={data.sections.gallery} />
    </>
  );
}
