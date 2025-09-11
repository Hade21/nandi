import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  return (
    // <div className="space-y-2">
    //   <div className="flex items-center justify-center gap-4">
    //     <Image src={icons[type]} alt={type} width={30} height={30} />
    //     <h1 className="text-center font-semibold text-lg">{name}</h1>
    //   </div>
    //   <Separator />
    //   <p className="text-center font-light text-xs">{egi}</p>
    //   <div className="flex flex-wrap gap-4">
    //     <div className="flex items-center gap-3 flex-1 w-full">
    //       <Image src={"/location.svg"} alt="Location" width={20} height={20} />
    //       <p className="text-left font-semibold text-sm">{locationName}</p>
    //     </div>
    //     <div className="flex items-center gap-3 flex-1 w-full">
    //       <Image src={"/date.svg"} alt="Last updated" width={20} height={20} />
    //       <p className="text-left font-semibold text-sm">
    //         {timeStampFormatted}
    //       </p>
    //     </div>
    //   </div>
    //   <div className="flex pt-4 justify-center">
    //     <PopoverClose>
    //       <Button onClick={onClick}>Edit Location</Button>
    //     </PopoverClose>
    //   </div>
    // </div>
    <motion.div
      className={`min-w-24 bg-white text-slate-950 p-3 dark:bg-slate-900 dark:text-slate-50 rounded-xl shadow-md overflow-hidden cursor-pointer space-y-2 ${
        isExpanded ? "w-80" : "w-fit"
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
