import React from "react";
import { Hero } from "../components/Hero";
import { HorsesSection } from "../components/HorsesSection";
import { useAppData } from "../state/AppDataContext";

export function HorsesPage() {
  const { data } = useAppData();

  return (
    <>
      <Hero hero={data.sections.hero} page="nasi-kone" />
      <h1 className="visually-hidden">Naše koně</h1>
      <HorsesSection horses={data.sections.horses} page="nasi-kone" />
    </>
  );
}
