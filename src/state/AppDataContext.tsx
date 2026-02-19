import React, { createContext, useContext, useState } from "react";
import type { AppData } from "../data/defaultData";
import { loadData, saveData } from "../utils/storage";

const PREFERRED_FONT_STACK = "'Avenir Next', 'Avenir', 'Helvetica Neue', Helvetica, Arial, sans-serif";

interface AppDataContextValue {
  data: AppData;
  setData: (_dataOrUpdater: AppData | ((_previous: AppData) => AppData)) => void;
  persist: () => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setDataState] = useState<AppData>(() => {
    const loaded = loadData();
    if (loaded?.settings) {
      loaded.settings.fontFamily = PREFERRED_FONT_STACK;
      saveData(loaded);
    }
    return loaded;
  });

  const setData = (updater: AppData | ((_p: AppData) => AppData)) => {
    setDataState((p) => (typeof updater === "function" ? updater(p) : updater));
  };

  const persist = () => {
    saveData(data);
  };

  return (
    <AppDataContext.Provider value={{ data, setData, persist }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
