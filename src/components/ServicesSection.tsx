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
        id: "tabory",
        title: "Tábory",
        lead: "Příměstské i pobytové programy zaměřené na koně, přírodu a praktické dovednosti.",
        description:
          "Děti se během táborů učí bezpečnému kontaktu s koňmi, základům péče, práci ze země i jízdě. Program je vedený hravou formou a přizpůsobený věku i zkušenostem.",
        items: services.items.filter(isCamp),
      },
      {
        id: "krouzky",
        title: "Kroužky",
        lead: "Pravidelné lekce pro děti, které chtějí dlouhodobě jezdit a rozvíjet vztah ke koním.",
        description:
          "Kroužky kombinují teorii i praxi - od péče o koně přes práci na jízdárně až po vyjížďky. Důraz je na bezpečnost, systematický rozvoj a radost z pohybu.",
        items: services.items.filter(isClub),
      },
      {
        id: "vyjizdky",
        title: "Vyjížďky",
        lead: "Individuální i vedené jízdy v přírodě pro začátečníky i pokročilé jezdce.",
        description:
          "Vyjížďky jsou vhodné pro děti i dospělé. Podle zkušeností volíme tempo i trasu tak, aby byl zážitek bezpečný, příjemný a přínosný.",
        items: services.items.filter(isRide),
      },
    ];

    return (
      <section id="services" className="section container">
        <div className="service-page-stack cards-bg-title" data-bg-title="Služby">
          {groups.map((group, index) => (
            <article
              key={group.id}
              className={`service-feature ${index % 2 === 1 ? "service-feature-reverse" : ""} ${uiPatterns.FloatingServiceCard}`}
            >
              <div className="service-feature-body">
                <h3>{group.title}</h3>
                <p className="service-feature-lead">{group.lead}</p>
                <p>{group.description}</p>
                <div className="service-feature-rich-list">
                  {(group.items.length > 0 ? group.items : services.items).map((item) => (
                    <div key={`${group.id}-${item.title}`} className="service-feature-rich-item">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                      <strong className="service-feature-price">{item.price}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
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
          <div className="home-service-stack cards-bg-title" data-bg-title="Služby">
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
      <div className="card-grid cards-bg-title" data-bg-title="Služby">
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
