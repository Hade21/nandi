import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

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
            <AlertDialogAction onClick={useGPSLocation}>
              Use My Location
            </AlertDialogAction>
            <div className="h-2"></div>
            <AlertDialogAction onClick={pinOnMap}>
              Pin On Maps
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogLocation;
