import React from "react";
import { ContactSection } from "../components/ContactSection";
import { useAppData } from "../state/AppDataContext";

export function ContactPage() {
  const { data } = useAppData();

  return (
    <>
      <h1 className="visually-hidden">Kontakt</h1>
      <ContactSection contact={data.sections.contact} />
    </>
  );
}
