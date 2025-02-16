import { create } from "zustand";
import { Listing } from "@/types/listing";
import { getListings } from "@/lib/listings";

interface ListingsState {
  listings: Listing[];
  setListings: (listings: Listing[]) => void;
  getListing: (id: number) => Listing | undefined;
  fetchListings: () => Promise<void>;
}

export const useListingsStore = create<ListingsState>((set, get) => ({
  listings: [],
  setListings: (listings) => set({ listings }),
  getListing: (id) => get().listings.find((l) => l.id === id),
  fetchListings: async () => {
    const listings = await getListings();
    set({ listings });
  },
}));
