import { create } from "zustand";
import { DeveloperProfile } from "@/types/profile";

interface ProfileStore {
  profile: DeveloperProfile | null;
  setProfile: (profile: DeveloperProfile) => void;
  updateProfile: (updates: Partial<DeveloperProfile>) => void;
}

const defaultProfile: DeveloperProfile = {
  name: "Paul Lodland",
  title: "Principal Developer",
  company: "Belveron Partners",
  location: "San Francisco Bay Area",
  experience: 15,
  imageUrl: "/belveron-partners.jpg",
  specialization: ["Urban Mixed-Use", "Transit-Oriented Development"],
  investmentPreferences: {
    propertyTypes: ["Mixed-use", "Multi-family"],
    marketTypes: ["Urban Core", "Tech Hubs"],
    dealSize: {
      min: 5000000,
      max: 50000000,
    },
    targetMarkets: ["San Francisco", "Oakland", "San Jose"],
  },
  investmentThesis:
    "Focus on sustainable, mixed-use developments in high-growth urban markets with strong tech presence.",
  riskProfile: "Moderate",
  sustainabilityFocus: true,
  preferredStructure: ["Joint Venture", "Fund Investment"],
  developmentTypes: ["Ground-up Development", "Adaptive Reuse"],
  exitStrategy: ["Hold Long-term", "Refinance and Hold"],
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: defaultProfile,
  setProfile: (profile) => set({ profile }),
  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),
}));
