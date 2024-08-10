"use client";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useState } from "react";

export const defaultMapsContainerStyle = {
  width: "100%",
  height: "80vh",
  borderRadius: "15px",
};

const Maps = () => {
  const [myLoc, setMyLoc] = useState({ lat: 0, lng: 0 });

  function onPositionUpdate(position: GeolocationPosition) {
    console.log("🚀 ~ onPositionUpdate ~ position:", position);
    let lng: number = position.coords.longitude;
    let lat: number = position.coords.latitude;

    return setMyLoc({ lat, lng });
  }

  const defaultMapCenter = {
    lat: -2.175375,
    lng: 115.5584851,
  };

  const defaultMapOption = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: "auto",
    mapTypeId: "satellite",
  };

  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(onPositionUpdate, (error) =>
      console.log(error)
    );
  else console.log("geolocation not supported");

  return (
    <div>
      <GoogleMap
        mapContainerStyle={defaultMapsContainerStyle}
        center={defaultMapCenter}
        options={defaultMapOption}
        zoom={18}
      >
        {/* <Marker position={defaultMapCenter} /> */}
        <MarkerF position={myLoc} label="My location" />
      </GoogleMap>
    </div>
  );
};

export default Maps;
