import React from "react";
import { Hero } from "../components/Hero";
import { ContactSection } from "../components/ContactSection";
import { useAppData } from "../state/AppDataContext";

export function ContactPage() {
  const { data } = useAppData();

  return (
    <>
      <Hero hero={data.sections.hero} page="kontakt" />
      <h1 className="visually-hidden">Kontakt</h1>
      <ContactSection contact={data.sections.contact} />
    </>
  );
}
