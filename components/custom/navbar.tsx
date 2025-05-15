import { Dumbbell } from "lucide-react"; // Added Dumbbell import
import Image from "next/image";
import Link from "next/link";

import { auth, signOut } from "@/app/(auth)/auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";

import { History } from "./history";
// SlashIcon might not be needed anymore if we remove it from the branding
// import { SlashIcon } from "./icons"; // Commenting out or removing if not used elsewhere
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const Navbar = async () => {
  const session = await auth(); // Changed let to const

  return (
    <>
      <div className="bg-background absolute top-0 left-0 w-dvw py-2 px-3 justify-between flex flex-row items-center z-30">
        <div className="flex flex-row gap-3 items-center">
          <History user={session?.user} />
          {/* New Branding */}
          <div className="flex flex-row gap-2 items-center">
            <Dumbbell size={24} className="text-primary" />
            <span className="text-lg font-semibold bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
              Mandaleen Fit
            </span>
          </div>
        </div>

        {session && (
          <div className="flex flex-row items-center gap-2">
            <ThemeToggle />
          </div>
        )}
      </div>
    </>
  );
};
