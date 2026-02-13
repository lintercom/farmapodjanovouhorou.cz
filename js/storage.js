import { defaultData, STORAGE_KEY } from "./defaultData.js";

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const fallback = deepClone(defaultData);
    saveData(fallback);
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    return mergeWithDefaults(parsed, defaultData);
  } catch (error) {
    const fallback = deepClone(defaultData);
    saveData(fallback);
    return fallback;
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetToDefault() {
  const fallback = deepClone(defaultData);
  saveData(fallback);
  return fallback;
}

export function exportData(data) {
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

export function importDataFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const merged = mergeWithDefaults(parsed, defaultData);
        resolve(merged);
      } catch (error) {
        reject(new Error("Soubor není platný JSON backup."));
      }
    };
    reader.onerror = () => reject(new Error("Import se nepodařilo načíst."));
    reader.readAsText(file);
  });
}

function mergeWithDefaults(source, fallback) {
  if (Array.isArray(fallback)) {
    return Array.isArray(source) ? source : fallback;
  }
  if (typeof fallback !== "object" || fallback === null) {
    return source === undefined || source === null ? fallback : source;
  }

  const output = {};
  Object.keys(fallback).forEach((key) => {
    output[key] = mergeWithDefaults(source?.[key], fallback[key]);
  });

  if (source && typeof source === "object" && !Array.isArray(source)) {
    Object.keys(source).forEach((key) => {
      if (output[key] === undefined) output[key] = source[key];
    });
  }

  return output;
}
