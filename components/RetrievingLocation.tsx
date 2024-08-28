import { TailSpin } from "react-loader-spinner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const RetrievingLocation = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogTitle>Getting Location</AlertDialogTitle>
        <AlertDialogDescription className="w-full flex items-center justify-between">
          <p>Please wait while we locating your device...</p>
          <TailSpin height={20} width={20} color="#3b82f6" />
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RetrievingLocation;
