"use client";
import { useParams } from "next/navigation";
import { ResearchView } from "@/components/research-view";

export default function ListingResearchPage() {
  const { location } = useParams();
  const parsedLocation = decodeURIComponent(location as string);

  return (
    <main className="min-h-screen py-8">
      <div className="container max-w-6xl">
        <ResearchView location={parsedLocation} />
      </div>
    </main>
  );
}
