import FormUnit from "@/components/FormUnit";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Unit",
  description: "Add new unit",
};

const NewUnits = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <FormUnit type="new" />
    </div>
  );
};

export default NewUnits;
