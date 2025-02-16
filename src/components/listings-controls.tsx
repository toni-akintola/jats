import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ListingFilters, Listing } from "@/types/listing";

interface ListingsControlsProps {
  filters: ListingFilters;
  onFilterChange: (filters: ListingFilters) => void;
  sortBy: keyof Listing | "roi";
  onSortChange: (sort: keyof Listing | "roi") => void;
  sortDirection: "asc" | "desc";
  onSortDirectionChange: (direction: "asc" | "desc") => void;
}

export function ListingsControls({
  filters,
  onFilterChange,
  sortBy,
  onSortChange,
  sortDirection,
  onSortDirectionChange,
}: ListingsControlsProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          value={filters.propertyType}
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              propertyType: value as Listing["propertyType"],
            })
          }
        >
          <SelectTrigger className="bg-white/5">
            <SelectValue placeholder="Property Type" />
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

        <Select
          value={sortBy}
          onValueChange={(value) =>
            onSortChange(value as keyof Listing | "roi")
          }
        >
          <SelectTrigger className="bg-white/5">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="roi">ROI</SelectItem>
            <SelectItem value="timeline">Timeline</SelectItem>
            <SelectItem value="size">Size</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortDirection}
          onValueChange={(value) =>
            onSortDirectionChange(value as "asc" | "desc")
          }
        >
          <SelectTrigger className="bg-white/5">
            <SelectValue placeholder="Sort Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min Price"
            className="bg-white/5"
            value={filters.minPrice || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <Input
            type="number"
            placeholder="Max Price"
            className="bg-white/5"
            value={filters.maxPrice || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className={filters.favorites ? "bg-white/20" : "bg-white/5"}
          onClick={() =>
            onFilterChange({ ...filters, favorites: !filters.favorites })
          }
        >
          Favorites Only
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/5"
          onClick={() => onFilterChange({})}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
