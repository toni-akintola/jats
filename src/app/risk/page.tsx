"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { RiskAssessment } from "@/services/types";

export default function RiskPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState<RiskAssessment | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/risk-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to assess risk");
      }

      const assessment = await response.json();
      setRiskData(assessment);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to assess risk",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-8">
      <div className="container">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">
          Property Risk Assessment
        </h1>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter property address..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Analyzing..." : "Assess Risk"}
            </Button>
          </div>
        </form>

        {riskData && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 bg-gray-800 text-white">
              <h2 className="text-xl font-semibold mb-4">Location Details</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">County:</span>{" "}
                  {riskData.location.county}
                </p>
                <p>
                  <span className="font-medium">State:</span>{" "}
                  {riskData.location.state}
                </p>
                {/* <p><span className="font-medium">FEMA Region:</span> {riskData.femaRegion.name}</p> */}
                <p>
                  <span className="font-medium">Risk Score:</span>{" "}
                  {riskData.riskScore.toFixed(1)}/100
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-gray-800 text-white">
              <h2 className="text-xl font-semibold mb-4">Disaster Types</h2>
              <div className="space-y-2">
                {Object.entries(riskData.disastersByType).map(
                  ([type, count]) => (
                    <div key={type} className="flex justify-between">
                      <span>{type}:</span>
                      <span>{count} incidents</span>
                    </div>
                  ),
                )}
              </div>
            </Card>

            <Card className="p-6 bg-gray-800 text-white md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Recent Disasters</h2>
              <div className="space-y-4">
                {riskData.recentDisasters.map((disaster) => (
                  <div
                    key={disaster.disasterNumber}
                    className="border-b border-gray-700 pb-4 last:border-0"
                  >
                    <h3 className="font-medium">{disaster.title}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(disaster.declarationDate).toLocaleDateString()}{" "}
                      - {disaster.incidentType}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gray-800 text-white md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Historical Trends</h2>
              <div className="space-y-2">
                {riskData.historicalTrends.map((trend) => (
                  <div key={trend.year} className="flex justify-between">
                    <span>{trend.year}:</span>
                    <span>{trend.disasterCount} disasters</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
