"use client";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { SetStateAction, useCallback, useEffect, useState } from "react";

export const defaultMapsContainerStyle = {
  width: "100%",
  height: "100vh",
  borderRadius: "15px",
};

interface MapsProps {
  markers: {
    latitude: number;
    longitude: number;
    label: string;
  }[];
}

const Maps = ({ markers }: MapsProps) => {
  const [maps, setMaps] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(
    (maps: SetStateAction<google.maps.Map | null>) => setMaps(maps),
    []
  );

  useEffect(() => {
    if (maps && markers) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.map((marker) => {
        bounds.extend({
          lat: marker.latitude,
          lng: marker.longitude,
        });
      });
      maps.fitBounds(bounds);
    }
  }, [maps, markers]);

  console.log("🚀 ~ Maps ~ markers:", markers);

  return (
    <div>
      <GoogleMap
        mapContainerStyle={defaultMapsContainerStyle}
        zoom={10}
        onLoad={onLoad}
      >
        {markers &&
          markers.map((marker, index) => {
            if (marker.label === "My Position") {
              return (
                <Marker
                  key={index}
                  label={marker.label}
                  position={{ lat: marker.latitude, lng: marker.longitude }}
                  animation={google.maps.Animation.BOUNCE}
                  icon={{
                    url: "/car.png",
                    scaledSize: {
                      width: 40,
                      height: 40,
                      equals: () => true,
                    },
                  }}
                />
              );
            }
            return (
              <Marker
                key={index}
                label={marker.label}
                position={{ lat: marker.latitude, lng: marker.longitude }}
                animation={google.maps.Animation.DROP}
                icon={{
                  url: "/marker.png",
                  scaledSize: {
                    width: 40,
                    height: 40,
                    equals: () => true,
                  },
                }}
              />
            );
          })}
      </GoogleMap>
    </div>
  );
};

export default Maps;
