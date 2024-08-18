"use client";
import { useGetUnitsQuery } from "@/services/unitService";
import { MarkerTypes, UnitTypes } from "@/types";
import { useEffect, useState } from "react";
import Maps from "./Maps";

const MapsDataProvider = () => {
  const { isLoading, data, error } = useGetUnitsQuery();
  const [markers, setMarkers] = useState<MarkerTypes[]>();

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
    if (data) {
      data.data.forEach((unit: UnitTypes) => {
        setMarkers((prevMarkers) => {
          if (!prevMarkers) {
            return [
              {
                latitude: Number(
                  unit.locations![unit.locations!.length - 1].lat
                ),
                longitude: Number(
                  unit.locations![unit.locations!.length - 1].long
                ),
                label: unit.name,
              },
            ];
          } else {
            removeDuplicates(prevMarkers, unit.name);
            return [
              ...prevMarkers,
              {
                latitude: Number(
                  unit.locations![unit.locations!.length - 1].lat
                ),
                longitude: Number(
                  unit.locations![unit.locations!.length - 1].long
                ),
                label: unit.name,
              },
            ];
          }
        });
      });
    }
  }, [data]);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        setMarkers((prevMarkers) => {
          if (!prevMarkers) {
            return [
              {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                label: "My Position",
              },
            ];
          } else {
            removeDuplicates(prevMarkers, "My Position");
            return [
              ...prevMarkers,
              {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                label: "My Position",
              },
            ];
          }
        });
      });
    }
    return () => {
      navigator.geolocation.clearWatch(0);
    };
  }, []);

  return <div>{markers && <Maps markers={markers} />}</div>;
};

export default MapsDataProvider;
