import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info, TriangleAlert } from "lucide-react";

interface AlertComponentProps {
  variant: "default" | "destructive" | null | undefined;
  title: string;
  desc: string;
}

const AlertComponent = ({ variant, title, desc }: AlertComponentProps) => {
  return (
    <Alert variant={variant}>
      {variant === "destructive" && <TriangleAlert className="h-6 w-6" />}
      {variant === "default" && <Info className="h-6 w-6" />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{desc}</AlertDescription>
    </Alert>
  );
};

export default AlertComponent;
