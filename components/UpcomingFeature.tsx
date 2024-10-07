import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

interface UpcomingFeatureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpcomingFeature = ({ open, onOpenChange }: UpcomingFeatureProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upcoming Feature</AlertDialogTitle>
          <AlertDialogDescription>
            This feature is on development. Please check back later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={() => onOpenChange(false)}>Dismiss</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpcomingFeature;
