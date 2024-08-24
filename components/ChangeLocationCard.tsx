"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { cn } from "@/lib/utils";
import { setOpenModal } from "@/services/unitService";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const ChangeLocationCard = () => {
  const isOpen = useAppSelector((state) => state.units.openModal);
  const { name, type, egi, locationName } = useAppSelector(
    (state) => state.units.selectedUnit
  );
  const dispatch = useAppDispatch();

  const onSubmit = () => {
    dispatch(setOpenModal(false));
  };

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
      className={cn(
        "p-4 rounded-t-md bg-white dark:bg-slate-950 absolute bottom-0 w-full"
      )}
    >
      <div className="space-y-2">
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
        <div className="flex items-center space-x-2 h-6">
          <p className="w-1/3 text-sm">Location</p>
          <Separator orientation="vertical" />
          <p className="text-sm font-semibold">{locationName}</p>
        </div>
        <div className="flex pt-4 justify-center">
          <Button onClick={onSubmit}>Save Location</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChangeLocationCard;
