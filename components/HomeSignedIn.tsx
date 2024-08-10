import Maps from "./Maps";
import MapsProvider from "./MapsProvider";

const HomeSignedIn = () => {
  return (
    <MapsProvider>
      <Maps />
    </MapsProvider>
  );
};

export default HomeSignedIn;
