// import { TailSpin } from "react-loader-spinner";
import { MoonLoader } from "react-spinners";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const RetrievingLocation = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogTitle>Getting Location</AlertDialogTitle>
        <AlertDialogDescription className="flex items-center justify-between w-full">
          <p>Please wait while we locating your device...</p>
          <MoonLoader size={18} color="#3b82f6" />
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RetrievingLocation;
