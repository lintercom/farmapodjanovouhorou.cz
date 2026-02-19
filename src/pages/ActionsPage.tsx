import React from "react";
import { Hero } from "../components/Hero";
import { ActionsSection } from "../components/ActionsSection";
import { useAppData } from "../state/AppDataContext";

export function ActionsPage() {
  const { data } = useAppData();

  return (
    <>
      <Hero hero={data.sections.hero} page="akce" />
      <h1 className="visually-hidden">Akce</h1>
      <ActionsSection gallery={data.sections.gallery} />
    </>
  );
}
