"use client";
import { useEffect, useState } from "react";
import Maps from "./Maps";

const MapsDataProvider = () => {
  const [markers, setMarkers] = useState([
    {
      latitude: -2.176375,
      longitude: 115.5584851,
      label: "Location 1",
    },
    {
      latitude: -2.175275,
      longitude: 115.5604851,
      label: "Location 2",
    },
    {
      latitude: -2.175175,
      longitude: 115.5624851,
      label: "Location 3",
    },
    {
      latitude: -2.175075,
      longitude: 115.5644851,
      label: "Location 4",
    },
  ]);

  function removeDuplicates(arr: any, value: any) {
    let index = 0;
    while (index < arr.length) {
      if (arr[index].label === value) {
        arr.splice(index, 1);
      } else {
        index++;
      }
    }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        setMarkers((prevMarkers) => {
          removeDuplicates(prevMarkers, "My Position");
          return [
            ...prevMarkers,
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              label: "My Position",
            },
          ];
        });
      });
    }
    return () => {
      navigator.geolocation.clearWatch(0);
    };
  }, []);

  return (
    <div>
      <Maps markers={markers} />
    </div>
  );
};

export default MapsDataProvider;
