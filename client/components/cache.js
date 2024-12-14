"use client";

import { createContext, useEffect, useState } from "react";
import getClientId from "./server/getClientId";
import generateFingerPrint, { canvasFingerprint } from "./getFingerprint";

const CacheContext = createContext();

export function ClientCache({ children }) {
  const [cachedClientId, setCachedClientId] = useState(null);
  const [cachedFingerPrint, setCachedFingerPrint] = useState(null);
  const [cachedCanvasFingerPrint, setCachedCanvasFingerprint] = useState(null);

  useEffect(() => {
    const callClientId = async () => {
      const id = await getClientId();
      setCachedClientId(id);
    };
    const callFingerPrint = async () => {
      const print = await generateFingerPrint();
      setCachedFingerPrint(print);
    };
    const callCanvasFingerPrint = async () => {
      const canvasPrint = await canvasFingerprint({
        cachedCanvasFingerPrint: cachedCanvasFingerPrint,
      });
      setCachedCanvasFingerprint(canvasPrint);
    };
    callClientId();
    callFingerPrint();
    callCanvasFingerPrint();
  }, []);

  return (
    <CacheContext.Provider
      value={{
        cachedClientId,
        cachedFingerPrint,
        cachedCanvasFingerPrint,
        setCachedCanvasFingerprint,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
}

export default CacheContext;
