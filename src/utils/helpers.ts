export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function formatSectionTitle(title: string | undefined): string {
  const normalized = String(title ?? "").trim().replace(/[.]$/, "");
  if (!normalized) return "";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function getServiceLink(item: { title: string; description: string }): string {
  const content = `${item.title} ${item.description}`.toLowerCase();
  if (content.includes("tábor")) return "/sluzby#tabory";
  if (content.includes("krouž") || content.includes("krouzek")) return "/sluzby#krouzky";
  if (content.includes("vyjížď") || content.includes("poník") || content.includes("jízda")) return "/sluzby#vyjizdky";
  if (content.includes("kůň")) return "/nasi-kone";
  return "/sluzby";
}

export function getHorseImageSource(horse: { image?: string; photos?: string[] }): string {
  const directImage = String(horse?.image || "").trim();
  if (directImage) return directImage;
  const firstPhoto = String(horse?.photos?.[0] || "").trim();
  if (firstPhoto) return firstPhoto;
  return "";
}

export function getHorsePhotos(horse: { image?: string; photos?: string[] }): string[] {
  const photos = Array.isArray(horse?.photos) ? horse.photos.map((p) => String(p || "").trim()).filter(Boolean) : [];
  if (photos.length > 0) return photos;
  const fallback = getHorseImageSource(horse);
  return fallback ? [fallback] : [];
}

export function formatHorseCardSummary(text: string | undefined): string {
  const raw = String(text || "").trim();
  if (!raw) return "Klidný parťák pro práci ze země i jízdu v terénu.";
  if (raw.length <= 115) return raw;
  return `${raw.slice(0, 112).trimEnd()}...`;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Nepodařilo se nahrát obrázek."));
    reader.readAsDataURL(file);
  });
}
