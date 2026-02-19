import { defaultData, STORAGE_KEY, type AppData } from "../data/defaultData";

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function loadData(): AppData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const fallback = deepClone(defaultData);
    saveData(fallback);
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as AppData;
    return mergeWithDefaults(parsed, defaultData) as AppData;
  } catch {
    const fallback = deepClone(defaultData);
    saveData(fallback);
    return fallback;
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetToDefault(): AppData {
  const fallback = deepClone(defaultData);
  saveData(fallback);
  return fallback;
}

export function exportData(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "farm-cms-backup.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function importDataFromFile(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as AppData;
        const merged = mergeWithDefaults(parsed, defaultData) as AppData;
        resolve(merged);
      } catch {
        reject(new Error("Soubor není platný JSON backup."));
      }
    };
    reader.onerror = () => reject(new Error("Import se nepodařilo načíst."));
    reader.readAsText(file);
  });
}

function mergeWithDefaults(source: unknown, fallback: unknown): unknown {
  if (Array.isArray(fallback)) {
    return Array.isArray(source) ? source : fallback;
  }
  if (typeof fallback !== "object" || fallback === null) {
    return source === undefined || source === null ? fallback : source;
  }

  const output: Record<string, unknown> = {};
  Object.keys(fallback as Record<string, unknown>).forEach((key) => {
    output[key] = mergeWithDefaults(
      (source as Record<string, unknown>)?.[key],
      (fallback as Record<string, unknown>)[key]
    );
  });

  if (source && typeof source === "object" && !Array.isArray(source)) {
    Object.keys(source as Record<string, unknown>).forEach((key) => {
      if (output[key] === undefined) output[key] = (source as Record<string, unknown>)[key];
    });
  }

  return output;
}
