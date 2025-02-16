"use client";
import { usePathname, useRouter } from "next/navigation";
import { Listing } from "@/types/listing";
import Image from "next/image";
import { Heart, Building2, Timer, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PortfolioButton } from "@/components/portfolio-button";

// Array of apartment image paths
const APARTMENT_IMAGES = Array.from({ length: 19 }, (_, i) => `/${i + 1}.jpg`);

export function getRandomApartmentImage(): string {
  const randomIndex = Math.floor(Math.random() * APARTMENT_IMAGES.length);
  return APARTMENT_IMAGES[randomIndex];
}

interface ListingCardProps {
  listing: Listing;
  onFavoriteToggle?: (id: number) => void;
}

export function ListingCard({ listing, onFavoriteToggle }: ListingCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isSearch = pathname === "/search";

  const handleClick = () => {
    if (isSearch) {
      // If on dashboard, go to research page with location
      router.push(`/listing/${encodeURIComponent(listing.location)}`);
    } else {
      // Otherwise go to property details
      router.push(`/property/${listing.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all h-full flex flex-col cursor-pointer"
    >
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={getRandomApartmentImage()}
          alt={listing.location}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
          priority
        />
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onFavoriteToggle?.(listing.id);
          }}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        >
          <Heart
            className={`h-5 w-5 ${
              listing.isFavorite ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>
        <Badge
          variant="secondary"
          className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm"
        >
          {listing.status}
        </Badge>
      </div>
      <div className="p-6 flex flex-col flex-1">
        {/* Header Section - Fixed Height */}
        <div className="min-h-[120px]">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="font-semibold text-white text-lg leading-tight">
                {listing.location}
              </h3>
              <p className="text-white/60 text-sm mt-1">{listing.subtitle}</p>
            </div>
            <Badge variant="outline" className="bg-white/5 shrink-0">
              {listing.propertyType}
            </Badge>
          </div>

          <p className="text-white/80 text-sm leading-relaxed mt-3 line-clamp-2">
            {listing.opportunity}
          </p>
        </div>

        {/* Main Content Section - Flexible Height */}
        <div className="space-y-4 flex-1 my-4">
          <div className="flex flex-wrap gap-2">
            {listing.marketHighlights.map((highlight, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-white/5 text-xs"
              >
                {highlight}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-white/80">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="text-sm">
                {listing.size.squareFeet
                  ? `${formatPrice(listing.size.squareFeet)} sqft`
                  : `${listing.size.acres} acres`}
              </span>
            </div>
            {listing.timeline && (
              <div className="flex items-center gap-2 text-white/80">
                <Timer className="h-4 w-4 shrink-0" />
                <span className="text-sm">{listing.timeline}</span>
              </div>
            )}
          </div>

          {listing.roi && (
            <div className="flex items-center gap-2 text-white/80">
              <TrendingUp className="h-4 w-4 shrink-0" />
              <span className="text-sm">
                {listing.roi.projected}% ROI ({listing.roi.timeframe})
              </span>
            </div>
          )}
        </div>

        {/* Footer Section - Fixed Height */}
        <div className="pt-4 border-t border-white/10 mt-auto">
          <div className="flex justify-between items-end gap-4">
            <div>
              <p className="text-white font-semibold text-lg">
                ${formatPrice(listing.price)}
              </p>
              {listing.pricePerSqFt && (
                <p className="text-white/60 text-sm">
                  ${listing.pricePerSqFt}/sqft
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm font-medium">
                {listing.zoning}
              </p>
              <p className="text-white/60 text-xs mt-1">
                {listing.potentialUse.join(", ")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <PortfolioButton listing={listing} size="sm" />
        </div>
      </div>
    </div>
  );
}
