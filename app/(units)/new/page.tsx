import AuthWrapper from "@/components/AuthWrapper";
import FormUnit from "@/components/FormUnit";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Unit",
  description: "Add new unit",
};

const NewUnits = () => {
  return (
    <AuthWrapper>
      <div className="w-full min-h-screen flex justify-center items-center">
        <FormUnit type="new" />
      </div>
    </AuthWrapper>
  );
};

export default NewUnits;
