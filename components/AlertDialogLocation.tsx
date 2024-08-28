import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

interface AlertDialogLocationProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  useGPSLocation: () => void;
  pinOnMap: () => void;
}

const AlertDialogLocation = ({
  isOpen,
  onOpenChange,
  useGPSLocation,
  pinOnMap,
}: AlertDialogLocationProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Pick the newest location!</AlertDialogTitle>
          <AlertDialogDescription>
            Choose to update the location. <br />
            Use your current GPS location or pin on maps
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction>
              <Button onClick={useGPSLocation}>Use My Location</Button>
            </AlertDialogAction>
            <AlertDialogAction>
              <Button onClick={pinOnMap}>Pin On Maps</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogLocation;
