"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Loader2,
  MapPin,
  Building2,
  Timer,
  TrendingUp,
  ChevronLeft,
} from "lucide-react";
import { useListingsStore } from "@/store/listings-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function PropertyPage() {
  const { id } = useParams();
  const { listings, getListing, fetchListings } = useListingsStore();

  useEffect(() => {
    if (listings.length === 0) {
      fetchListings();
    }
  }, [listings.length, fetchListings]);

  const listing = getListing(Number(id));

  if (!listing) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container max-w-6xl">
        {/* Back Button */}
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className="mb-6 text-white/60 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
        </Link>

        <div className="space-y-8">
          {/* Hero Section */}
          <div className="relative h-[60vh] rounded-2xl overflow-hidden">
            <img
              src={listing.imageUrl}
              alt={listing.location}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <Badge variant="secondary" className="mb-4">
                {listing.propertyType}
              </Badge>
              <h1 className="text-4xl font-bold text-white mb-2">
                {listing.subtitle}
              </h1>
              <div className="flex items-center text-white/80">
                <MapPin className="h-5 w-5 mr-2" />
                {listing.location}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview Section */}
              <section className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Overview</h2>
                <p className="text-white/80 leading-relaxed">
                  {listing.opportunity}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className="space-y-1">
                    <p className="text-white/60 text-sm">Price</p>
                    <p className="text-white font-semibold">
                      ${formatPrice(listing.price)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white/60 text-sm">Price/SqFt</p>
                    <p className="text-white font-semibold">
                      ${listing.pricePerSqFt}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white/60 text-sm">Size</p>
                    <p className="text-white font-semibold">
                      {formatPrice(listing.size.squareFeet)} sqft
                      {listing.size.acres && ` (${listing.size.acres} acres)`}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white/60 text-sm">Status</p>
                    <Badge variant="outline" className="bg-white/5">
                      {listing.status}
                    </Badge>
                  </div>
                </div>
              </section>

              {/* Market Highlights */}
              <section className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">
                  Market Highlights
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {listing.marketHighlights.map((highlight, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/80">{highlight}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Potential Uses */}
              <section className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">
                  Potential Uses
                </h2>
                <div className="flex flex-wrap gap-2">
                  {listing.potentialUse.map((use, i) => (
                    <Badge key={i} variant="secondary" className="bg-white/5">
                      {use}
                    </Badge>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column - Investment Details */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Investment Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white/80">
                    <Building2 className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-sm text-white/60">Zoning</p>
                      <p className="font-medium">{listing.zoning}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Timer className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-sm text-white/60">Timeline</p>
                      <p className="font-medium">{listing.timeline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <TrendingUp className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-sm text-white/60">Projected ROI</p>
                      <p className="font-medium">
                        {listing.roi.projected}% over {listing.roi.timeframe}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Contact Agent
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
