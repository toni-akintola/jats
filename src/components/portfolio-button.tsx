"use client";
import { Button } from "@/components/ui/button";
import { useListingsStore } from "@/store/listings-store";
import { Listing } from "@/types/listing";
import { Plus, Check } from "lucide-react";
import { useState } from "react";

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
  const [isAdded, setIsAdded] = useState(isInPortfolio(listing.id));

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
        isAdded ? "bg-green-600 hover:bg-green-700" : ""
      } transition-colors`}
    >
      {isAdded ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          In Portfolio
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
