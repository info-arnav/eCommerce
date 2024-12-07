"use client";

import { createContext, useEffect, useState } from "react";
import getClientId from "./server/getClientId";
import generateFingerPrint from "./getFingerprint";

const CacheContext = createContext();

export function ClientCache({ children }) {
  const [cachedClientId, setCachedClientId] = useState(null);
  const [cachedFingerPrint, setCachedFingerPrint] = useState(null);

  useEffect(() => {
    const callClientId = async () => {
      const id = await getClientId();
      setCachedClientId(id);
    };
    const callFingerPrint = async () => {
      const print = await generateFingerPrint();
      setCachedFingerPrint(print);
    };
    callClientId();
    callFingerPrint();
  }, []);

  return (
    <CacheContext.Provider value={{ cachedClientId, cachedFingerPrint }}>
      {children}
    </CacheContext.Provider>
  );
}

export default CacheContext;
