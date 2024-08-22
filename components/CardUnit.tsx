import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface CardUnitProps {
  name: string;
  type: string;
  egi: string;
  locationName: string;
}
const CardUnit = ({ name, type, egi, locationName }: CardUnitProps) => {
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
      <div className="flex pt-4 justify-center">
        <Button variant="default">Edit Location</Button>
      </div>
    </div>
  );
};

export default CardUnit;
