import ChangeLocationCard from "./ChangeLocationCard";
import MapsDataProvider from "./MapsDataProvider";
import MapsProvider from "./MapsProvider";

const HomeSignedIn = () => {
  return (
    <MapsProvider>
      <MapsDataProvider />
      <ChangeLocationCard />
    </MapsProvider>
  );
};

export default HomeSignedIn;
