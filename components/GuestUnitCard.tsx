import Image from "next/image";
import { Separator } from "./ui/separator";

interface GuestUnitCardProps {
  name: string;
  type: string;
  egi: string;
  locationName: string;
  timeStamp?: string;
}
const GuestUnitCard = ({
  name,
  type,
  egi,
  locationName,
  timeStamp,
}: GuestUnitCardProps) => {
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
        <div className="flex items-start gap-3 flex-1 w-full">
          <Image src={"/location.svg"} alt="Location" width={20} height={20} />
          <p className="text-left font-semibold text-sm">{locationName}</p>
        </div>
        <div className="flex items-start gap-3 flex-1 w-full">
          <Image src={"/date.svg"} alt="Last updated" width={20} height={20} />
          <p className="text-left font-semibold text-sm">
            {timeStampFormatted}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestUnitCard;
