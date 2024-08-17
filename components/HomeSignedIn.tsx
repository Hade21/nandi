import MapsDataProvider from "./MapsDataProvider";
import MapsProvider from "./MapsProvider";

const HomeSignedIn = () => {
  return (
    <MapsProvider>
      <MapsDataProvider />
    </MapsProvider>
  );
};

export default HomeSignedIn;
