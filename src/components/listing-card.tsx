import { Listing } from "@/types/listing";
import Image from "next/image";
import { Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
  onFavoriteToggle?: (id: number) => void;
}

export function ListingCard({ listing, onFavoriteToggle }: ListingCardProps) {
  return (
    <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={listing.imageUrl}
          alt={listing.location}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <button
          onClick={() => onFavoriteToggle?.(listing.id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        >
          <Heart
            className={`h-5 w-5 ${
              listing.isFavorite ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-white">{listing.location}</h3>
          <div className="flex items-center gap-1 text-white/80">
            <span>★</span>
            <span>{listing.rating}</span>
          </div>
        </div>
        <p className="text-white/60 text-sm mb-2">{listing.subtitle}</p>
        <p className="text-white/60 text-sm mb-4">{listing.dates}</p>
        <p className="text-white font-semibold">
          ${formatPrice(listing.price)}{" "}
          <span className="text-white/60">total</span>
        </p>
      </div>
    </div>
  );
}
