import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Listing } from "@/types/listing";

interface ListingsState {
  listings: Listing[];
  portfolio: Listing[];
  fetchListings: () => Promise<void>;
  getListing: (id: number) => Listing | undefined;
  addToPortfolio: (listing: Listing) => void;
  removeFromPortfolio: (id: number) => void;
  isInPortfolio: (id: number) => boolean;
}

export const useListingsStore = create<ListingsState>()(
  persist(
    (set, get) => ({
      listings: [],
      portfolio: [],
      fetchListings: async () => {
        try {
          const response = await fetch("/api/listings");
          const data = await response.json();
          set({ listings: data });
        } catch (error) {
          console.error("Failed to fetch listings:", error);
        }
      },
      getListing: (id) => {
        return get().listings.find((l) => l.id === id);
      },
      addToPortfolio: (listing) => {
        set((state) => ({
          portfolio: [...state.portfolio, listing],
        }));
      },
      removeFromPortfolio: (id) => {
        set((state) => ({
          portfolio: state.portfolio.filter((l) => l.id !== id),
        }));
      },
      isInPortfolio: (id) => {
        return get().portfolio.some((l) => l.id === id);
      },
    }),
    {
      name: "listings-storage",
    },
  ),
);
