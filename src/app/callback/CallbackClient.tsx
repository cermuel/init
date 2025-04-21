"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const CallbackClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) return;

    const getToken = async () => {
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: `${window.location.origin}/callback`,
        client_id: "cd0028742e934e208e089105c84c97cc",
        client_secret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!,
      });

      try {
        const res = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        });

        const data = await res.json();

        if (data.access_token) {
          localStorage.setItem("spotify_token", data.access_token);
          router.push("/");
        } else {
          console.error("Failed to get token", data);
        }
      } catch (err) {
        console.error("Fetch token error", err);
      }
    };

    getToken();
  }, []);

  return (
    <div className="p-4 flex bg-black w-screen h-screen justify-center items-center text-white">
      Logging in...
    </div>
  );
};

export default CallbackClient;
