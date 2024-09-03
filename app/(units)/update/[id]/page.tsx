import AuthWrapper from "@/components/AuthWrapper";
import FormUnit from "@/components/FormUnit";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Unit",
};

const Update = ({ params }: { params: { id: string } }) => {
  return (
    <AuthWrapper>
      <div className="w-full min-h-screen flex justify-center items-center">
        <FormUnit type="update" id={params.id} />
      </div>
    </AuthWrapper>
  );
};

export default Update;
