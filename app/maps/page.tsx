import ChangeLocationCard from "@/components/ChangeLocationCard";
import MapsDataProvider from "@/components/MapsDataProvider";
import MapsProvider from "@/components/MapsProvider";

const page = () => {
  return (
    <MapsProvider>
      <MapsDataProvider />
      <ChangeLocationCard />
    </MapsProvider>
  );
};

export default page;
