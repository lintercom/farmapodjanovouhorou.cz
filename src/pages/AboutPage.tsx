import React from "react";
import { Hero } from "../components/Hero";
import { AboutSection } from "../components/AboutSection";
import { useAppData } from "../state/AppDataContext";

export function AboutPage() {
  const { data } = useAppData();

  return (
    <>
      <Hero hero={data.sections.hero} page="o-nas" />
      <h1 className="visually-hidden">O nás</h1>
      <AboutSection about={data.sections.about} />
    </>
  );
}
