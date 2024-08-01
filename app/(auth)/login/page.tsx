import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Metadata } from "next";
import LoginForm from "./form";

export const metadata: Metadata = {
  title: "Login",
};

const Login = () => {
  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm px-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
