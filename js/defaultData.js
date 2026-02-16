export const STORAGE_KEY = "farmCmsDataV2";

export const defaultData = {
  settings: {
    siteName: "Farma pod Janovu horou",
    logoText: "Farma pod Janovu horou",
    primaryColor: "#365902",
    secondaryColor: "#A9BF04",
    accentColor: "#D9B752",
    fontFamily: "'Avenir Next', 'Avenir', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    favicon: "migration_export/images/krouzky/krouzky__02__40942955f2cf.png",
    footerText: "Farma pod Janovou horou z.s. | Janova Hora 466, 763 12 Vizovice",
  },
  sections: {
    hero: {
      title: "Jízda na koni pro děti i dospělé",
      subtitle:
        "Rodinná BIO farma ve Vizovicích. Nabízíme vyjížďky, kroužky, tábory, exkurze na farmě i dárkové poukazy.",
      ctaText: "kontaktovat farmu",
      ctaTarget: "#contact",
      image: "migration_export/images/home/home__01__e2d13ee1b5b8.jpg",
    },
    about: {
      title: "Farma",
      text: "Jsme malá rodinná BIO farma. Chováme koně, skot Highland cattle i ovce Suffolk. Děti i dospělí u nás pracují s koňmi v terénu i na jízdárně a učí se péči o zvířata s respektem, bezpečně a prakticky.",
      image: "migration_export/images/o-nas2/o-nas2__01__7c611cea7880.jpg",
    },
    services: {
      title: "Tábory",
      items: [
        {
          title: "Vyjížďka do přírody",
          description: "Jízda na koni pro děti i dospělé v doprovodu instruktora.",
          price: "600 Kč / 60 min",
          image: "migration_export/images/sluzby/sluzby__04__19fac8bd6699.jpg",
        },
        {
          title: "Vedený kůň / poník",
          description: "Vycházka v přírodě na vedeném koni nebo poníkovi.",
          price: "30 min / 350 Kč, 60 min / 600 Kč",
          image: "migration_export/images/sluzby/sluzby__02__a9a2306ac50c.jpg",
        },
        {
          title: "Kroužky pro děti",
          description: "Pravidelné jezdecké kroužky od 7 let, teorie i praxe péče o koně.",
          price: "Dle termínu a obsazenosti",
          image: "migration_export/images/home/home__03__15404eb11d01.jpg",
        },
        {
          title: "Příměstské a pobytové tábory",
          description: "Jízda, péče o koně, práce ze země a doprovodný program na farmě.",
          price: "Příměstský 4 800 Kč | Pobytový 7 700 Kč",
          image: "migration_export/images/home/home__04__3ea30d97a193.jpg",
        },
        {
          title: "Exkurze pro školky a školy",
          description: "Praktické seznámení se zvířaty a životem na farmě.",
          price: "80 Kč / dítě",
          image: "migration_export/images/sluzby/sluzby__07__d2e483957165.jpg",
        },
      ],
    },
    horses: {
      title: "Koně",
      items: [
        {
          name: "Rolls Skal",
          breed: "Americký klusák",
          age: "nar. 1997",
          description: "Zkušený koňský profesor, dnes užívá klidný důchod.",
          image: "migration_export/images/nasi-kone/nasi-kone__01__95347093d7a7.jpg",
          photos: [
            "migration_export/images/nasi-kone/nasi-kone__01__95347093d7a7.jpg",
            "migration_export/images/nasi-kone/nasi-kone__11__607b4c4d4995.jpg",
            "migration_export/images/nasi-kone/nasi-kone__12__94ca54afe330.jpg",
          ],
        },
        {
          name: "Emira",
          breed: "Arabský plnokrevník",
          age: "nar. 2018",
          description: "Mladá talentovaná kobylka, jemná a vhodná pro zkušenější jezdce.",
          image: "migration_export/images/nasi-kone/nasi-kone__03__d57a97941507.jpg",
          photos: [
            "migration_export/images/nasi-kone/nasi-kone__03__d57a97941507.jpg",
            "migration_export/images/nasi-kone/nasi-kone__13__ba17396501be.jpg",
          ],
        },
        {
          name: "Khan Dengri",
          breed: "Achal-teke",
          age: "nar. 2009",
          description: "Plemenný hřebec s vyrovnanou povahou, výkonnost Endurance Z.",
          image: "migration_export/images/nasi-kone/nasi-kone__04__9acdd1d584cc.jpg",
          photos: [
            "migration_export/images/nasi-kone/nasi-kone__04__9acdd1d584cc.jpg",
            "migration_export/images/nasi-kone/nasi-kone__14__de0f58c781ca.jpg",
          ],
        },
        {
          name: "Tristan",
          breed: "Shagya arab",
          age: "nar. 2015",
          description: "Šikovný pracovitý kůň, trpělivý i pro začínající jezdce.",
          image: "migration_export/images/nasi-kone/nasi-kone__08__c7305fc18176.jpg",
          photos: [
            "migration_export/images/nasi-kone/nasi-kone__08__c7305fc18176.jpg",
            "migration_export/images/nasi-kone/nasi-kone__16__82e8664f158c.jpg",
          ],
        },
        {
          name: "Silver",
          breed: "Hafling x norik",
          age: "nar. 2010",
          description: "Klidný koník, který miluje kontakt a péči.",
          image: "migration_export/images/nasi-kone/nasi-kone__09__cdfb1f2b8daf.jpg",
          photos: [
            "migration_export/images/nasi-kone/nasi-kone__09__cdfb1f2b8daf.jpg",
            "migration_export/images/nasi-kone/nasi-kone__17__1e881a973898.jpg",
          ],
        },
        {
          name: "Maya",
          breed: "Pony",
          age: "nar. 2020",
          description: "Poník s vlastním názorem a velkou osobností.",
          image: "migration_export/images/nasi-kone/nasi-kone__10__efb82e2ce766.jpg",
          photos: [
            "migration_export/images/nasi-kone/nasi-kone__10__efb82e2ce766.jpg",
            "migration_export/images/nasi-kone/nasi-kone__15__8ada3eb8fe1d.jpg",
          ],
        },
      ],
    },
    gallery: {
      title: "Galerie",
      images: [
        {
          src: "migration_export/images/home/home__02__da287e964584.jpg",
          alt: "Kůň na farmě",
        },
        {
          src: "migration_export/images/home/home__05__cb2526f3b29b.jpg",
          alt: "Jízda v přírodě",
        },
        {
          src: "migration_export/images/o-nas2/o-nas2__05__58aef0f12e74.jpg",
          alt: "Život na farmě",
        },
        {
          src: "migration_export/images/sluzby/sluzby__05__f355f3ba5e60.jpg",
          alt: "Služby pro děti a dospělé",
        },
        {
          src: "migration_export/images/nasi-kone/nasi-kone__15__8ada3eb8fe1d.jpg",
          alt: "Naši koně",
        },
        {
          src: "migration_export/images/akce-na-farme/akce-na-farme__01__aec71777e69e.png",
          alt: "Akce na farmě",
        },
      ],
    },
    vouchers: {
      title: "Produkty",
      text: "Vedle jezdeckých aktivit nabízíme i farmářské produkty a dárkové poukazy. Pro aktuální nabídku nám napište nebo zavolejte.",
      items: [
        {
          name: "Vejce z farmy",
          description: "Čerstvá domácí vejce z drobnochovu",
          price: "dle aktuální nabídky",
        },
        {
          name: "BIO hovězí a jehněčí",
          description: "Maso z vlastního chovu, dle sezónní dostupnosti",
          price: "dle váhy a sezóny",
        },
        {
          name: "Dárkový poukaz",
          description: "Na vyjížďky, tábory nebo individuální program",
          price: "dle výběru",
        },
      ],
    },
    contact: {
      title: "Kontaktujte nás",
      address: "Farma pod Janovou horou z.s., Janova Hora 466, 763 12 Vizovice",
      phone: "+420 605 279 222",
      email: "farmapodjanovouhorou@seznam.cz",
      successMessage: "Děkujeme! Zpráva byla odeslána.",
    },
  },
};
