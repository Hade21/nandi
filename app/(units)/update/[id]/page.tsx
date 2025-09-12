import FormUnit from "@/components/FormUnit";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Unit",
};

const Update = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <FormUnit type="update" id={params.id} />
    </div>
  );
};

export default Update;
