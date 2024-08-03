import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Info, TriangleAlert } from "lucide-react";

interface AlertComponentProps {
  variant: "default" | "destructive" | null | undefined;
  title: string;
  desc: string;
  className?: string;
}

const AlertComponent = ({
  variant,
  title,
  desc,
  className,
}: AlertComponentProps) => {
  return (
    <Alert variant={variant} className={cn(`${className}`)}>
      {variant === "destructive" && <TriangleAlert className="h-5 w-5" />}
      {variant === "default" && <Info className="h-5 w-5" />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{desc}</AlertDescription>
    </Alert>
  );
};

export default AlertComponent;
