import React from "react";
import { Link } from "react-router-dom";
import { uiPatterns } from "../utils/uiTokens";
import { getServiceLink } from "../utils/helpers";
import type { AppData } from "../data/defaultData";

const isCamp = (item: { title: string; description: string }) =>
  /tábor/i.test(item.title) || /tábor/i.test(item.description);
const isClub = (item: { title: string; description: string }) =>
  /krouž|krouzek/i.test(item.title) || /krouž|krouzek/i.test(item.description);
const isRide = (item: { title: string; description: string }) =>
  /vyjížďka|jízda|poník|kůň/i.test(`${item.title} ${item.description}`);

const HOME_GROUPS = [
  {
    id: "tabory",
    title: "Tábory",
    summary:
      "Příměstské i pobytové tábory pro děti. Děti si užijí jízdu na koni, naučí se jak o ně pečovat a jak s nimi pracovat.",
  },
  {
    id: "krouzky",
    title: "Kroužky",
    summary:
      "Jezdecký kroužek je určen pro děti, které mají rády koně, chtějí s nimi trávit čas, učit se jezdit a starat se o ně.",
  },
  {
    id: "vyjizdky",
    title: "Vyjížďky",
    summary:
      "Vyjížďky do přírody jsou pro všechny, kdo chtějí na chvíli zpomalit, nadechnout se čerstvého vzduchu a užít si klidnou jízdu v sedle. Svět je totiž nejkrásnější právě z koňského hřbetu.",
  },
];

interface ServicesSectionProps {
  services: AppData["sections"]["services"];
  page: string;
}

export function ServicesSection({ services, page }: ServicesSectionProps) {
  if (page === "sluzby") {
    const groups = [
      {
        id: "tabory" as const,
        title: "Tábory",
        summary: "Pobytové i příměstské programy pro děti se zaměřením na péči o koně.",
        items: services.items.filter(isCamp),
      },
      {
        id: "krouzky" as const,
        title: "Kroužky",
        summary: "Pravidelné lekce pro děti, které chtějí jezdit a starat se o koně dlouhodobě.",
        items: services.items.filter(isClub),
      },
      {
        id: "vyjizdky" as const,
        title: "Vyjížďky",
        summary: "Vyjížďky do přírody a individuální jízdy pro začátečníky i pokročilé.",
        items: services.items.filter(isRide),
      },
    ];

    return (
      <section id="services" className="section container">
        <header className="service-page-head">
          <h2 className="section-title">Služby</h2>
          <p className="section-lead">
            Rychlý přehled všeho, co na farmě nabízíme. Vyber typ služby a hned uvidíš relevantní nabídku.
          </p>
        </header>
        <nav className="service-quick-nav" aria-label="Rychlá navigace služeb">
          {groups.map((g) => (
            <Link key={g.id} className="service-quick-card" to={`#${g.id}`}>
              <strong>{g.title}</strong>
              <span>{g.items.length} položek</span>
            </Link>
          ))}
        </nav>
        {groups.map((group) => (
          <section key={group.id} className="service-group" id={group.id}>
            <div className="service-group-head">
              <h3 className="section-subtitle">{group.title}</h3>
              <span className="service-group-count">{group.items.length} položek</span>
            </div>
            <p className="service-group-summary">{group.summary}</p>
            <div className="card-grid">
              {(group.items.length > 0 ? group.items : services.items).map((item) => (
                <article key={item.title} className="card">
                  <div className="card-body">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <strong>{item.price}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </section>
    );
  }

  if (page === "home") {
    const groups = HOME_GROUPS.map((g, i) => ({
      ...g,
      items: services.items.filter(
        i === 0 ? isCamp : i === 1 ? isClub : isRide
      ),
    }));

    return (
      <section id="services" className="section container">
        <div className={uiPatterns.FloatingPanel}>
          <div className="home-service-stack">
            {groups.map((group, index) => (
              <article
                key={group.id}
                className={`service-feature ${index % 2 === 1 ? "service-feature-reverse" : ""} ${uiPatterns.FloatingServiceCard}`}
              >
                <div className="service-feature-body">
                  <h3>{group.title}</h3>
                  <p>{group.summary}</p>
                  <Link className="btn btn-outline" to={`/sluzby#${group.id}`}>
                    Prohlédnout {group.title.toLowerCase()}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="section container">
      <h2 className="section-title">{services.title}</h2>
      <div className="card-grid">
        {services.items.map((item) => (
          <article key={item.title} className={`card ${uiPatterns.FloatingServiceCard}`}>
            <div className="card-body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <strong className="block mt-1">{item.price}</strong>
              <Link className="link-inline" to={getServiceLink(item)}>
                více <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
