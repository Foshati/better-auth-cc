"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Check, Minus } from "lucide-react";
import Image from "next/image";
import UiDark from "../app/(auth)/_lib/assets/img/UiDark.png";
import UiLight from "../app/(auth)/_lib/assets/img/UiLight.png";
import UiSystem from "../app/(auth)/_lib/assets/img/UiSystem.png";

const themes = [
  { id: "light", label: "Light", image: UiLight },
  { id: "dark", label: "Dark", image: UiDark },
  { id: "system", label: "System", image: UiSystem },
];

export default function ChooseTheme() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Ensure component is mounted on client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering before component is mounted
  if (!mounted) {
    return null;
  }

  return (
    <fieldset className="space-y-4 p-4 m-4">
      <legend className="text-sm font-medium leading-none text-foreground">Choose a theme</legend>
      <div className="flex gap-3">
        {themes.map((item) => (
          <label key={item.id} className="relative">
            <input
              type="radio"
              name="theme"
              value={item.id}
              checked={theme === item.id}
              onChange={() => setTheme(item.id)}
              className="peer sr-only"
            />
            <Image
              src={item.image}
              alt={item.label}
              width={88}
              height={70}
              className={`relative cursor-pointer overflow-hidden rounded-lg border border-input shadow-sm shadow-black/5 outline-offset-2 transition-colors peer-[:focus-visible]:outline peer-[:focus-visible]:outline-2 peer-[:focus-visible]:outline-ring/70 peer-checked:border-ring peer-checked:bg-accent peer-disabled:cursor-not-allowed peer-disabled:opacity-50`}
            />
            <span className="group mt-2 flex items-center gap-1 text-xs font-medium peer-disabled:opacity-50">
              <Check
                size={16}
                strokeWidth={2}
                className={`peer-checked:block hidden`}
                aria-hidden="true"
              />
              <Minus
                size={16}
                strokeWidth={2}
                className={`peer-checked:hidden block`}
                aria-hidden="true"
              />
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
