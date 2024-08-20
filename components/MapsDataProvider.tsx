"use client";
import Loading from "@/app/loading";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useGetUnitsQuery } from "@/services/unitApi";
import { setMarkers, setUnits } from "@/services/unitService";
import { MarkerTypes } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Maps from "./Maps";
import SearchBox from "./SearchBox";
import ThemeSwitcher from "./ThemeSwitcher";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

const MapsDataProvider = () => {
  const { isLoading, data, error } = useGetUnitsQuery();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const markers = useAppSelector((state) => state.units.markers);

  useEffect(() => {
    if (data) {
      dispatch(setUnits(data.data));
      const unitMarkers: MarkerTypes[] = data.data.map((unit) => {
        return {
          latitude: Number(unit.locations![0].lat),
          longitude: Number(unit.locations![0].long),
          label: unit.name,
          locationName: unit.locations![0].location,
        };
      });
      dispatch(setMarkers(unitMarkers));
    }
  }, [data, dispatch]);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: "Current Location",
        };
        dispatch(setMarkers([location]));
      });
    } else {
      toast({
        title: "Your location cannot be determined",
        description: "Please enable geolocation on your browser.",
        variant: "destructive",
      });
    }
    return () => {
      navigator.geolocation.clearWatch(0);
    };
  }, [dispatch]);

  if (isLoading) return <Loading />;

  if (error)
    return (
      <div className="w-full h-full flex justify-center items-center gap-4">
        <h1 className="text-xl font-bold">Error loading data</h1>
        <h2>Please check your internet connection and try again</h2>
        <Button variant="ghost" onClick={() => router.refresh()}>
          Refresh
        </Button>
      </div>
    );

  return (
    <div className="relative">
      <div className="search z-10 absolute lg:w-[60%] w-[97%] top-16 lg:top-2.5 left-1/2 -translate-x-1/2">
        <SearchBox />
      </div>
      <div className="theme absolute top-2.5 right-16 z-10">
        <ThemeSwitcher />
      </div>
      {markers && <Maps markers={markers} />}
    </div>
  );
};

export default MapsDataProvider;
