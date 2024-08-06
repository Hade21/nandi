import { MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ShootingStars } from "./ui/shooting-stars";
import { StarsBackground } from "./ui/stars-background";
import { TextGenerateEffect } from "./ui/text-generate-effect";

const HomeSignedOut = () => {
  return (
    <div>
      <div className="w-full min-h-screen flex flex-col justify-center items-center gap-2 z-50 relative">
        <h1 className="text-5xl text-center flex gap-4 flex-wrap font-bold justify-center">
          Welcome to
          <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text flex gap-2 items-center font-rubik-moonrocks">
            NANDI
            <MapPin color="#3b82f6" size={48} />
          </span>
        </h1>
        <h3 className="text-xl font-bold mt-4 sm:mt-0">
          <TextGenerateEffect
            words="Where you can find anything"
            duration={3}
          />
        </h3>
        <div className="buttons flex gap-2 flex-wrap max-w-48 justify-center items-center mt-8">
          <Button asChild className="w-full sm:w-[calc(50%-0.25rem)]">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="w-full sm:w-[calc(50%-0.25rem)]">
            <Link href="/register">Register</Link>
          </Button>
          <p className="w-full text-center">or</p>
          <Button variant="ghost" className="w-full">
            Login as Guest
          </Button>
        </div>
      </div>
      <ShootingStars />
      <StarsBackground />
    </div>
  );
};

export default HomeSignedOut;
