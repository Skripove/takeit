import React, { createContext, useContext } from "react";
import type { Storage } from "@/hooks/useTakeItStorage";
import { useTakeItStorage } from "@/hooks/useTakeItStorage";

export const StorageContext = createContext<Storage | null>(null);

export function StorageProvider({ children }: { children?: React.ReactNode }) {
  const storage = useTakeItStorage();
  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage(): Storage {
  const storage = useContext(StorageContext);
  if (storage === null) {
    throw new Error("useStorage must be used within StorageProvider");
  }
  return storage;
}
