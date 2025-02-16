import { useState, useEffect } from 'react';
import { SentimentDashboard } from './sentiment-dashboard';
import { Card } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import type { RiskAssessment } from '@/services/types';
import { AreaChart, type DataPoint } from '@/components/ui/area-chart';

interface TabbedDashboardProps {
  address: string;
  onClose: () => void;
  onRemoveLocation: (location: string, isLast: boolean) => void;
  onRiskDataLoaded?: (address: string, riskScore: number) => void;
}

type RiskDataMap = Record<string, RiskAssessment>;

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export const getRiskColor = (score: number) => {
  if (score < 33) return '#10b981';  // green
  if (score < 66) return '#f59e0b';  // yellow
  return '#ef4444';                  // red
};

export function TabbedDashboard({ address, onClose, onRemoveLocation, onRiskDataLoaded }: TabbedDashboardProps) {
  const [activeTab, setActiveTab] = useState<'sentiment' | 'risk'>('sentiment');
  const [riskDataMap, setRiskDataMap] = useState<RiskDataMap>({});
  const [locations, setLocations] = useState<string[]>([address]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Add new location when address prop changes
  useEffect(() => {
    if (!locations.includes(address)) {
      setLocations(prev => [...prev, address]);
    }
  }, [address]);

  const fetchRiskData = async (locationToFetch: string) => {
    if (riskDataMap[locationToFetch]) return; // Don't fetch if we already have data for this location
    setLoading(true);
    try {
      const response = await fetch("/api/risk-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: locationToFetch }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to assess risk");
      }

      const assessment = await response.json();
      setRiskDataMap(prev => ({
        ...prev,
        [locationToFetch]: assessment
      }));
      
      // Notify parent component about the risk score
      onRiskDataLoaded?.(locationToFetch, assessment.riskScore);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to assess risk",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch risk data for all locations when tab changes to risk
  useEffect(() => {
    if (activeTab === 'risk') {
      locations.forEach(loc => fetchRiskData(loc));
    }
  }, [activeTab, locations]);

  // Helper function to get all unique disaster types across all locations
  const getAllDisasterTypes = () => {
    const types = new Set<string>();
    Object.values(riskDataMap).forEach(data => {
      Object.keys(data.disastersByType).forEach(type => types.add(type));
    });
    return Array.from(types);
  };

  // Helper function to get all years across all locations
  const getAllYears = () => {
    const years = new Set<number>();
    Object.values(riskDataMap).forEach(data => {
      data.historicalTrends.forEach(trend => years.add(trend.year));
    });
    return Array.from(years).sort((a, b) => a - b);
  };

  const handleRemoveLocation = (location: string, isLast: boolean) => {
    setLocations(prev => prev.filter(loc => loc !== location));
    setRiskDataMap(prev => {
      const newMap = { ...prev };
      delete newMap[location];
      return newMap;
    });
    onRemoveLocation(location, isLast);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Location Bubbles */}
      <div className="p-6 flex flex-wrap gap-2">
        {locations.map(location => (
          <div
            key={location}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full text-white"
          >
            <span>{location}</span>
            <button
              onClick={() => handleRemoveLocation(location, locations.length === 1)}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('sentiment')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'sentiment'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Sentiment Analysis
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'risk'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Risk Assessment
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'sentiment' ? (
          <SentimentDashboard
            locations={locations}
            onClose={onClose}
            onRemoveLocation={handleRemoveLocation}
          />
        ) : (
          <div className="p-6 space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : Object.keys(riskDataMap).length > 0 ? (
              <>
                {/* Location Cards */}
                {Object.entries(riskDataMap).map(([loc, data]) => (
                  <Card key={loc} className="p-6 bg-gray-800/50 text-white">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p><span className="font-medium">County:</span> {data.location.county}</p>
                        <p><span className="font-medium">State:</span> {data.location.state}</p>
                        {/* <p><span className="font-medium">FEMA Region:</span> {data.femaRegion.name}</p> */}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Risk Score:</span>
                          <span className="text-sm">{data.riskScore.toFixed(1)}/100</span>
                        </div>
                        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${data.riskScore}%`,
                              backgroundColor: getRiskColor(data.riskScore)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Comparative Disaster Types */}
                <Card className="p-6 bg-transparent border-none text-white">
                  <h2 className="text-xl font-semibold mb-4">Disaster Types</h2>
                  <div className="h-[600px] bg-gray-800/50 rounded-xl py-12 px-6">
                    <AreaChart
                      data={getAllDisasterTypes().map(type => {
                        const dataPoint: DataPoint = { date: type };
                        Object.entries(riskDataMap).forEach(([loc, data]) => {
                          dataPoint[loc] = data.disastersByType[type] || 0;
                        });
                        return dataPoint;
                      })}
                      title=""
                      config={Object.fromEntries(
                        Object.keys(riskDataMap).map((loc, index) => [
                          loc,
                          { 
                            label: loc, 
                            color: COLORS[index % COLORS.length],
                            type: 'bar',
                          },
                        ])
                      )}
                      xAxisKey="date"
                    />
                  </div>
                </Card>

                {/* Recent Disasters Timeline */}
                <Card className="p-6 bg-gray-800/50 text-white">
                  <h2 className="text-xl font-semibold mb-4">Recent Disasters Timeline</h2>
                  <div className="space-y-4">
                    {Object.entries(riskDataMap).map(([loc, data]) => (
                      <div key={loc} className="border-b border-gray-700 pb-4 last:border-0">
                        <h3 className="font-medium mb-2">{loc}</h3>
                        <div className="space-y-2">
                          {data.recentDisasters.map((disaster) => (
                            <div key={disaster.disasterNumber} className="text-sm">
                              <span className="text-gray-400">
                                {new Date(disaster.declarationDate).toLocaleDateString()}
                              </span>
                              <span className="mx-2">-</span>
                              <span>{disaster.incidentType}:</span>
                              <span className="ml-2">{disaster.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Comparative Historical Trends */}
                <Card className="p-6 bg-transparent border-none text-white">
                  <h2 className="text-xl font-semibold mb-4">Natural Disasters over time</h2>
                  
                  {/* Historical Trends Chart */}
                  <div className="h-[600px] bg-gray-800/50 rounded-xl py-12 px-6">
                    <AreaChart
                      data={getAllYears().map(year => {
                        const dataPoint: DataPoint = { date: year.toString() };
                        Object.entries(riskDataMap).forEach(([loc, data]) => {
                          const trend = data.historicalTrends.find(t => t.year === year);
                          Object.assign(dataPoint, { [loc]: trend?.disasterCount || 0 });
                        });
                        return dataPoint;
                      })}
                      title=""
                      config={Object.fromEntries(
                        Object.keys(riskDataMap).map((loc, index) => [
                          loc,
                          { 
                            label: loc, 
                            color: COLORS[index % COLORS.length],
                            type: 'line',
                          },
                        ])
                      )}
                      xAxisKey="date"
                    />
                  </div>
                </Card>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
} 