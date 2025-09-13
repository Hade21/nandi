"use client";

import { Switch } from "@/components/animate-ui/components/base/switch";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [checked, setChecked] = useState(false);
  const ThumbIcon = checked ? <MoonIcon /> : <SunIcon />;
  const { setTheme } = useTheme();

  useEffect(() => {
    if (checked) setTheme("dark");
    else setTheme("light");
  }, [checked, setTheme]);

  return (
    <div className="cursor-pointer" aria-labelledby="Theme Switcher">
      <Switch
        checked={checked}
        onCheckedChange={(value) => setChecked(value)}
        aria-label="Toggle theme switcher"
        startIcon={<SunIcon />}
        endIcon={<MoonIcon />}
        thumbIcon={ThumbIcon}
      />
    </div>
  );
};

export default ThemeSwitcher;
