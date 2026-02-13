# Migrace obsahu do microsite CMS

## Co bylo nalezeno

- Zdrojová složka: `migration_export/`
- ZIP archivy:
  - `content.zip` (5 položek)
  - `images.zip` (56 položek)
- Rozbalené adresáře:
  - `migration_export/content/`
  - `migration_export/images/`

## Datové zdroje použité pro migraci

- `migration_export/content/content_by_page.json`
- `migration_export/content/content_by_page.md`
- `migration_export/content/content_summary.md`
- `migration_export/content/content_inventory.csv`
- `migration_export/images/index.json`

## Stručná obsahová analýza

- Původní web obsahuje 14 stránek.
- Pro nový web jsme mapovali hlavně tyto části:
  - `home` -> Hero + základní nabídka
  - `o-nas2` -> sekce O nás
  - `sluzby` + `cenik` + `krouzky` + `tabory` -> sekce Služby
  - `nasi-kone` -> sekce Naši koně
  - `kontaktujte-nas` -> sekce Kontakt
  - `home` + `o-nas2` + `sluzby` + `nasi-kone` + `akce-na-farme` -> Galerie
  - `home` + zmínky o poukazu -> Dárkové poukazy

## Poznámky k mapování

- Některé stránky v exportu jsou články/samostatné podstránky (např. SAWER) a nebyly mapovány do hlavních sekcí microsite.
- Ve zdroji se vyskytují duplicity (např. `home` dvakrát), byly sloučeny.
- Obrázky byly napojeny na lokální cesty v projektu přes `migration_export/images/...`.
- Výchozí obsah CMS byl přepsán migrovanými daty v `js/defaultData.js`.

## Technická změna

- Byl navýšen storage klíč na `farmCmsDataV2`, aby se po migraci načetl nový výchozí obsah i u již existujícího prohlížečového localStorage.
