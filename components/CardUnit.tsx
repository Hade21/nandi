import { PopoverClose } from "@radix-ui/react-popover";
import Image from "next/image";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface CardUnitProps {
  name: string;
  type: string;
  egi: string;
  locationName: string;
  onClick?: () => void;
  timeStamp?: string;
}
const CardUnit = ({
  name,
  type,
  egi,
  locationName,
  onClick,
  timeStamp,
}: CardUnitProps) => {
  const date = new Date(timeStamp!);
  const timeStampFormatted = `${date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} ${date.toLocaleTimeString("id-ID", {
    hour: "numeric",
    minute: "numeric",
  })}`;
  const icons = {
    "TOWER LAMP": "/street-light.png",
    GENSET: "/generator.svg",
    "WELDING MACHINE": "/welding-machine.png",
    "AIR COMPRESSOR": "/air-compressor.png",
  } as { [key: string]: string };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center gap-4">
        <Image src={icons[type]} alt={type} width={30} height={30} />
        <h1 className="text-center font-semibold text-lg">{name}</h1>
      </div>
      <Separator />
      <p className="text-center font-light text-xs">{egi}</p>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-1 w-full">
          <Image src={"/location.svg"} alt="Location" width={20} height={20} />
          <p className="text-left font-semibold text-sm">{locationName}</p>
        </div>
        <div className="flex items-center gap-3 flex-1 w-full">
          <Image src={"/date.svg"} alt="Last updated" width={20} height={20} />
          <p className="text-left font-semibold text-sm">
            {timeStampFormatted}
          </p>
        </div>
      </div>
      <div className="flex pt-4 justify-center">
        <PopoverClose>
          <Button onClick={onClick}>Edit Location</Button>
        </PopoverClose>
      </div>
    </div>
  );
};

export default CardUnit;
