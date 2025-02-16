"use client";
import { Button } from "@/components/ui/button";
import { useListingsStore } from "@/store/listings-store";
import { Listing } from "@/types/listing";
import { Plus, Check, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface PortfolioButtonProps {
  listing: Listing;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function PortfolioButton({
  listing,
  variant = "outline",
  size = "default",
}: PortfolioButtonProps) {
  const { addToPortfolio, removeFromPortfolio, isInPortfolio } =
    useListingsStore();
  const pathname = usePathname();
  const isPropertyRoute = pathname.startsWith("/property/");
  const isPortfolioRoute = pathname === "/portfolio";
  const shouldBeInPortfolio = isPropertyRoute || isPortfolioRoute;

  const [isAdded, setIsAdded] = useState(isInPortfolio(listing.id));

  useEffect(() => {
    if (shouldBeInPortfolio && !isAdded) {
      addToPortfolio(listing);
      setIsAdded(true);
    }
  }, [shouldBeInPortfolio, isAdded, addToPortfolio, listing]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Prevent event bubbling

    if (isAdded) {
      removeFromPortfolio(listing.id);
    } else {
      addToPortfolio(listing);
    }
    setIsAdded(!isAdded);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`${
        isAdded
          ? "bg-[#f4ac7b] hover:bg-[#d8897b] text-[#0e3b5c] border-[#f4ac7b]"
          : ""
      } transition-colors`}
    >
      {isAdded ? (
        <>
          <Trash2 className="h-4 w-4 mr-2" />
          Remove from Portfolio
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 mr-2" />
          Add to Portfolio
        </>
      )}
    </Button>
  );
}
