"use client";
import { useJsApiLoader } from "@react-google-maps/api";
import React from "react";
import { TailSpin } from "react-loader-spinner";

const MapsProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
  });

  if (loadError)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p>Encountered error while loading google maps</p>
      </div>
    );

  if (!isLoaded)
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <h1 className="flex items-center justify-center gap-2">
          Loading google maps{" "}
          <TailSpin height={20} width={20} color="#3b82f6" />
        </h1>
      </div>
    );

  return children;
};

export default MapsProvider;
