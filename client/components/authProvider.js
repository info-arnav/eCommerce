"use client";

import { createContext, useEffect, useState } from "react";
import createCookie from "./server/createCookie";
import getClientId from "./server/getClientId";
import getCookie from "./server/getCookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState("hi");
  const [refreshToken, setRefreshToken] = useState(null);
  const [trackId, setTrackId] = useState(null);

  // Establish track id

  useEffect(() => {
    const createSession = async () => {
      const cookie_track_id = await getCookie("track_id");
      if (cookie_track_id) {
        setTrackId(cookie_track_id);
        return;
      }
      const response = await fetch("http://localhost:1234/track", {
        method: "POST",
        "Content-Type": "application/json",
        body: JSON.stringify({
          client_id: await getClientId(),
          method: "create",
        }),
      });
      const track_data = await response.json();
      if (track_data.track_id) {
        setTrackId(track_data.track_id);
        createCookie("track_id", track_data.track_id);
      }
    };
    createSession();
  }, []);

  // Update Path

  useEffect(() => {
    const updateSession = async () => {
      await fetch("http://localhost:1234/track", {
        method: "POST",
        "Content-Type": "application/json",
        body: JSON.stringify({
          client_id: await getClientId(),
          user_track_id: trackId,
          method: "update",
          path: window.location.pathname,
        }),
      });
    };
    if (trackId) {
      updateSession();
    }
  }, [trackId]);

  // Remove track id

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      navigator.sendBeacon(
        `http://localhost:1234/track`,
        JSON.stringify({
          client_id: await getClientId(),
          method: "end",
        })
      );
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
