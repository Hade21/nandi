"use client";
import Loading from "@/app/loading";
import useNetworkStatus from "@/hooks/networkStatus";
import {
  useGetAllUnitsQuery,
  useUpdateLocationMutation,
} from "@/hooks/queryUnitHooks";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  setMarkers,
  setOpenModal,
  setSelectedUnit,
  setUnits,
} from "@/services/unitService-old";
import { MarkerTypes, UnitTypes } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SearchBox from "../../components/SearchBox";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import { Button } from "../../components/ui/button";
import Maps from "./Maps";

interface UnitData {
  id: string;
  long: string;
  lat: string;
  alt: string;
  location: string;
  dateTime: string;
  accessToken: string;
}

const MapsDataProvider = () => {
  const { data, error, isRefetching, isLoading } = useGetAllUnitsQuery();
  const { mutate } = useUpdateLocationMutation();
  const router = useRouter();
  const { data: user } = useSession();
  const dispatch = useAppDispatch();
  const { isOnline } = useNetworkStatus();
  const markers = useAppSelector((state) => state.units.markers);
  const searchQuery = useAppSelector((state) => state.units.searchQuery);
  const isUpdating = useAppSelector((state) => state.units.isUpdating);
  const [location, setLocation] = useState<MarkerTypes | undefined>(undefined);

  useEffect(() => {
    const update = async (data: UnitData[]) => {
      if (!user?.user.accessToken) {
        toast.info("There is pending update exist", {
          description:
            "Please login and stay connected to continue updating location",
          action: (
            <Button
              onClick={() => {
                router.push("/login");
              }}
            >
              Login
            </Button>
          ),
        });
        return;
      }
      if (user.user.id) {
        if (data.length > 0) {
          toast.info("Updating location", {
            description: "There is pending update exist, we'll work on this",
          });
          data.forEach((unit: UnitData) => {
            const body = new FormData();
            body.append("alt", unit.alt);
            body.append("long", unit.long);
            body.append("lat", unit.lat);
            body.append("location", unit.location);
            body.append("dateTime", unit.dateTime);
            body.append("createdBy", user?.user.id ?? "");
            mutate(body);
          });
        }
        localStorage.removeItem("updatePending");
        return;
      }
    };

    const pendingUpdate = localStorage.getItem("updatePending");
    const storedData = pendingUpdate ? JSON.parse(pendingUpdate) : [];
    if (storedData.length > 0) {
      update(storedData);
    }
  }, [router, isOnline, mutate, user?.user.accessToken, user?.user.id]);
  useEffect(() => {
    if (searchQuery && data) {
      const unit = data?.data.filter((units: UnitTypes) => {
        return units.id === searchQuery;
      });
      const latestLocation = unit![0].locations!.slice(-1)[0] ?? null;
      if (!latestLocation) {
        toast.error("Location not found", {
          description: "Please set location",
        });
        dispatch(setOpenModal(true));
        const selectedUnit: any = {
          selectedUnit: {
            id: unit![0].id ?? "",
            egi: unit![0].egi ?? "",
            name: unit![0].name ?? "",
            type: unit![0].type ?? "",
            locationName: "",
            timeStamp: "",
          },
        };
        dispatch(setSelectedUnit(selectedUnit));
        return;
      }
      const location = [
        {
          latitude: Number(latestLocation!.lat),
          longitude: Number(latestLocation!.long),
          label: unit![0].name,
          locationName: latestLocation!.location,
          timeStamp: latestLocation!.dateTime,
        },
      ];
      dispatch(setMarkers(location));
    } else if (data && data.data.length > 0) {
      dispatch(setUnits(data.data));
      const locations: MarkerTypes[] = [];
      if (data?.data.length > 0) {
        data?.data.forEach((unit: UnitTypes, index: number) => {
          if (
            data.data[index].locations &&
            data.data[index]!.locations.length > 0
          ) {
            locations.push({
              latitude: Number(unit.locations![unit.locations!.length - 1].lat),
              longitude: Number(
                unit.locations![unit.locations!.length - 1].long
              ),
              label: unit.name,
              locationName:
                unit.locations![unit.locations!.length - 1].location,
              timeStamp: unit.locations![unit.locations!.length - 1].dateTime,
            });
          }
        });
      }
      dispatch(setMarkers(locations));
    }
  }, [data, dispatch, searchQuery]);
  useEffect(() => {
    if (!isUpdating) {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              label: "Current Location",
              heading: position.coords.heading,
            };

            setLocation(location);
          },
          (error) => {},
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000,
          }
        );
      } else {
        toast.error("Location not found", {
          description: "Please enable geolocation on your browser.",
        });
      }
    }
    return () => {
      navigator.geolocation.clearWatch(0);
    };
  }, [isUpdating, location]);
  useEffect(() => {
    if (isRefetching) toast.info("Updating data...");
  }, [isRefetching]);

  if (isLoading) return <Loading />;

  if (error)
    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-screen gap-3">
        <h1 className="text-xl font-bold">Error loading data</h1>
        <h2>
          Something Error with Server or Network. Please try again in few
          seconds.
        </h2>
        <Button variant="secondary" onClick={() => router.refresh()}>
          Refresh
        </Button>
      </div>
    );

  return (
    <div className="relative">
      <div className="search z-10 absolute w-1/3 sm:top-2.5 sm:left-1/2 sm:-translate-x-1/2 top-14 left-2 min-w-48">
        <SearchBox />
      </div>
      <div className="theme absolute top-2.5 right-16 z-10">
        <ThemeSwitcher />
      </div>
      {markers && <Maps markers={markers} myLocation={location} />}
    </div>
  );
};

export default MapsDataProvider;
