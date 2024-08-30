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
  const timeStampFormatted = `${date.toLocaleDateString()} ${date.toLocaleTimeString(
    "id-ID",
    { hour: "numeric", minute: "numeric" }
  )}`;

  return (
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
      <div className="flex items-center space-x-2 h-10">
        <p className="w-1/3 text-sm">Last Updated</p>
        <Separator orientation="vertical" />
        <p className="text-sm font-semibold">{timeStampFormatted}</p>
      </div>
    </div>
  );
};

export default GuestUnitCard;
