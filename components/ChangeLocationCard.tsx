"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { setMarkers, setOpenModal } from "@/services/unitService";
import { MarkerTypes } from "@/types";
import { locationNameSchema } from "@/validator/unit";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AlertDialogLocation from "./AlertDialogTemplate";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";

const ChangeLocationCard = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [unitData, setUnitData] = useState({
    id: "",
    locationName: "",
    lat: "",
    long: "",
  });
  const isOpen = useAppSelector((state) => state.units.openModal);
  const { id, name, type, egi, locationName } = useAppSelector(
    (state) => state.units.selectedUnit
  );
  const dispatch = useAppDispatch();
  const form = useForm<Pick<MarkerTypes, "locationName">>({
    resolver: zodResolver(locationNameSchema),
  });

  const onSubmit = () => {
    dispatch(setOpenModal(false));
  };
  const useGPSLocation = () => {
    console.log("use GPS");
    if (navigator.geolocation) {
      console.log("use navigation");
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: name,
        };
        dispatch(setMarkers([location]));
        setUnitData({
          lat: position.coords.latitude.toString(),
          long: position.coords.longitude.toString(),
          id,
          locationName: name,
        });
      });
    } else {
      toast({
        title: "Your location cannot be determined",
        description: "Please enable geolocation on your browser.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    form.setValue("locationName", locationName);
  }, [form, locationName]);
  useEffect(() => {
    if (isOpen) {
      setDialogOpen(true);
    }
  }, [isOpen]);

  return (
    <motion.div
      animate={
        isOpen
          ? {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              display: "block",
              height: "fit-content",
            }
          : {
              y: 100,
              opacity: 0,
              filter: "blur(10px)",
              display: "none",
              height: 0,
            }
      }
      className="p-4 rounded-t-md bg-white dark:bg-slate-950 absolute bottom-0 w-full"
    >
      <div>
        <Form {...form}>
          <form className="space-y-3">
            <h1 className="text-center font-semibold text-lg">{name}</h1>
            <Separator />
            <div className="flex items-center space-x-2 h-6">
              <p className="w-1/3 text-sm">Type</p>
              <Separator orientation="vertical" />
              <p className="text-sm font-semibold">{type}</p>
            </div>
            <div className="flex items-center space-x-2 h-6">
              <p className="w-1/3 text-sm">EGI</p>
              <Separator orientation="vertical" />
              <p className="text-sm font-semibold">{egi}</p>
            </div>
            <div className="flex items-center space-x-2 h-7 mt-4">
              <p className="w-1/3 text-sm">Location</p>
              <Separator orientation="vertical" />
              <FormField
                control={form.control}
                name="locationName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Location Name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* <p className="text-sm font-semibold">{locationName}</p> */}
            </div>
            <div className="flex pt-4 justify-center">
              <Button onClick={onSubmit}>Save Location</Button>
            </div>
          </form>
        </Form>
      </div>
      <AlertDialogLocation
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        useGPSLocation={useGPSLocation}
        pinOnMap={() => {
          setDialogOpen(false);
        }}
      />
    </motion.div>
  );
};

export default ChangeLocationCard;
