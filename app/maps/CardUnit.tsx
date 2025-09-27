import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { setSelectedUnit } from "@/services/unitService-old";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";

interface CardUnitProps {
  id: string;
  name: string;
  type: string;
  egi: string;
  locationName: string;
  onClick?: () => void;
  timeStamp?: string;
}
const CardUnit = ({
  id,
  name,
  type,
  egi,
  locationName,
  onClick,
  timeStamp,
}: CardUnitProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const units = useAppSelector((state) => state.units.units);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const date = new Date(timeStamp!);
  const timeStampFormatted = `${date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} ${date.toLocaleTimeString("id-ID", {
    hour: "numeric",
    minute: "numeric",
  })}`;

  useEffect(() => {
    if (isExpanded) {
      const unitData = units.filter((unit) => unit.id === id)[0];
      const marker = unitData.locations![unitData.locations!.length - 1];
      const unit = {
        selectedUnit: {
          id: id,
          egi: egi,
          name: name,
          type: type,
          locationName: marker.location,
          timeStamp: marker.dateTime,
        },
      };
      dispatch(setSelectedUnit(unit));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  return (
    <motion.div
      className={`min-w-24 bg-white text-slate-950 p-3 dark:bg-slate-900 dark:text-slate-50 rounded-xl shadow-md overflow-hidden cursor-pointer space-y-2 ${
        isExpanded ? "w-80 translate-y-1/6" : "w-fit"
      }`}
      layout // Enables layout animations
      onClick={() => setIsExpanded(!isExpanded)}
      initial={{ height: "auto" }}
      animate={{ height: isExpanded ? "auto" : "auto" }}
      transition={{ type: "spring", damping: 25 }}
    >
      {/* Header with Lamp Icon */}
      <motion.div className="flex items-center justify-center gap-4" layout>
        {isExpanded && (
          <div className="w-fit h-fit rounded-full bg-blue-400 mr-3 flex items-center justify-center">
            <div className="w-fit h-fit p-2 rounded-full bg-blue-400 animate-pulse">
              <Image src={selectIcon(type)} alt={type} width={30} height={30} />
            </div>
          </div>
        )}
        <motion.h3
          className={`font-semibold ${isExpanded ? "text-lg" : "text-xs"}`}
          layout="position"
        >
          {name}
        </motion.h3>
      </motion.div>
      {isExpanded && (
        <motion.div layout>
          <Separator />
        </motion.div>
      )}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <motion.p
            className="text-gray-600 dark:text-gray-400 text-center text-xs"
            layout
          >
            {egi}
          </motion.p>

          {/* Footer */}
          <motion.div className="flex flex-wrap gap-4" layout>
            <div className="flex items-center gap-3 flex-1 w-full">
              <Image
                src={"/location.svg"}
                alt="Location"
                width={20}
                height={20}
              />
              <span className="text-sm font-semibold text-left">
                {locationName}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-1 w-full">
              <Image
                src={"/date.svg"}
                alt="Last updated"
                width={20}
                height={20}
              />
              <span className="text-sm font-semibold text-left">
                {timeStampFormatted}
              </span>
            </div>
            {status === "authenticated" && (
              <div className="action flex items-center justify-center gap-3 w-full">
                <Button type="button" onClick={onClick}>
                  Update Location
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    router.push(`/update/${id}`);
                  }}
                >
                  Edit Unit Data
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

function selectIcon(type: string) {
  switch (type) {
    case "TOWER LAMP":
      return "/tower-lamp.png";
    case "GENSET":
      return "/generator.svg";
    case "AIR COMPRESSOR":
      return "/air-compressor.png";
    case "MEGA TOWER":
      return "/mega-tower.svg";
    case "WELDING MACHINE":
      return "/welding-machine.png";
  }
  return "/location.png"; // Fallback icon
}

export default CardUnit;
