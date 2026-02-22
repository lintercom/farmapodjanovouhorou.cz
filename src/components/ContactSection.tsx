import React, { useState } from "react";
import { uiPatterns } from "../utils/uiTokens";
import { isValidEmail } from "../utils/validators";
import type { AppData } from "../data/defaultData";

interface ContactSectionProps {
  contact: AppData["sections"]["contact"];
}

export function ContactSection({ contact }: ContactSectionProps) {
  const [successMsg, setSuccessMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !message || !isValidEmail(email)) {
      setSuccessMsg("Zkontrolujte prosím vyplněné údaje.");
      setIsError(true);
      setEmailInvalid(true);
      return;
    }

    setEmailInvalid(false);
    setSuccessMsg(contact.successMessage);
    setIsError(false);
    form.reset();
  };

  return (
    <section id="contact" className="section container">
      <div className="split contact-split cards-bg-title" data-bg-title="Kontakt">
        <address className="text-card contact-info-card">
            <p>
              <strong>Adresa:</strong> {contact.address}
            </p>
            <p>
              <strong>Telefon:</strong>{" "}
              <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
            <a className="link-inline" href="https://mapy.cz" target="_blank" rel="noreferrer">
              zobrazit na mapě <span aria-hidden="true">→</span>
            </a>
          </address>
          <form
            id="contact-form"
            className={`contact-form vstack gap-2 ${uiPatterns.MinimalContentCard}`}
            noValidate
            aria-describedby="contact-success"
            onSubmit={handleSubmit}
          >
            <label htmlFor="contact-name">Jméno</label>
            <input
              id="contact-name"
              className={`form-control ${uiPatterns.FormField}`}
              type="text"
              name="name"
              required
            />
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              className={`form-control ${uiPatterns.FormField}`}
              type="email"
              name="email"
              required
              aria-invalid={emailInvalid}
            />
            <label htmlFor="contact-message">Zpráva</label>
            <textarea
              id="contact-message"
              className={`form-control ${uiPatterns.FormField}`}
              name="message"
              rows={4}
              required
            />
            <button className="btn btn-primary" type="submit">
              Odeslat
            </button>
            <p
              className={`success-msg ${isError ? "is-error" : ""}`}
              id="contact-success"
              aria-live="polite"
            >
              {successMsg}
            </p>
          </form>
      </div>
    </section>
  );
}
