"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertySearchProps {
  onSearch: (params: {
    location: string;
    propertyType?: string;
    priceRange?: string;
  }) => void;
  isLoading: boolean;
  error: string | null;
}

export function PropertySearch({
  onSearch,
  isLoading,
  error,
}: PropertySearchProps) {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState<string>();
  const [priceRange, setPriceRange] = useState<string>();

  const handleSearch = () => {
    onSearch({ location, propertyType, priceRange });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-white/60">Location</label>
          <Input
            placeholder="Enter city or region"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/60">Property Type</label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Development Site">Development Site</SelectItem>
              <SelectItem value="Renovation">Renovation</SelectItem>
              <SelectItem value="Value-Add">Value-Add</SelectItem>
              <SelectItem value="Redevelopment">Redevelopment</SelectItem>
              <SelectItem value="Land">Land</SelectItem>
              <SelectItem value="Adaptive Reuse">Adaptive Reuse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/60">Price Range</label>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-5M">Under $5M</SelectItem>
              <SelectItem value="5M-10M">$5M - $10M</SelectItem>
              <SelectItem value="10M-25M">$10M - $25M</SelectItem>
              <SelectItem value="25M-50M">$25M - $50M</SelectItem>
              <SelectItem value="50M+">$50M+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between items-start gap-4">
        <Button
          onClick={handleSearch}
          disabled={!location || isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Find Opportunities
        </Button>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    </div>
  );
}
