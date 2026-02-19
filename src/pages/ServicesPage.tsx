import React from "react";
import { Hero } from "../components/Hero";
import { ServicesSection } from "../components/ServicesSection";
import { useAppData } from "../state/AppDataContext";

export function ServicesPage() {
  const { data } = useAppData();

  return (
    <>
      <Hero hero={data.sections.hero} page="sluzby" />
      <h1 className="visually-hidden">Služby</h1>
      <ServicesSection services={data.sections.services} page="sluzby" />
    </>
  );
}
