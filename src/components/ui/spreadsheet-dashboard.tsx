"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { analyzeSentiment } from "@/services/sentiment-service";
import { StaggeredDropdown, StaggeredDropdownProps } from "@/components/ui/dropdown";
import { FiHome, FiUser, FiFile } from "react-icons/fi";

interface Cell {
  value: string;
  id: string;
  isLoading?: boolean;
  sentiment?: number;
}

interface Row {
  id: string;
  cells: Cell[];
}

export function SpreadsheetDashboard() {
  const [rows, setRows] = useState<Row[]>(() => {
    // Initialize with 5 rows and 2 columns (Company Name | Sentiment)
    return Array.from({ length: 5 }, (_, rowIndex) => ({
      id: `row-${rowIndex}`,
      cells: Array.from({ length: 2 }, (_, colIndex) => ({
        id: `cell-${rowIndex}-${colIndex}`,
        value: "",
        isLoading: false,
      })),
    }));
  });

  const [activeCell, setActiveCell] = useState<string | null>(null);
  const { toast } = useToast();

  const dropdownOptions: StaggeredDropdownProps[] = [
    {
      text: "Home",
      Icon: FiHome,
      href: "/",
    },
    {
      text: "Profile",
      Icon: FiUser,
      href: "/profile",
    },
    {
      text: "Dashboard",
      Icon: FiFile,
      href: "/dashboard",
    },
  ];

  const handleCellClick = (cellId: string, cellIndex: number) => {
    // Only allow editing the company name column (index 0)
    if (cellIndex === 0) {
      setActiveCell(cellId);
    }
  };

  const handleCellChange = async (rowIndex: number, cellIndex: number, value: string) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[rowIndex].cells[cellIndex].value = value;
      return newRows;
    });
  };

  const analyzeSentimentForRow = async (rowIndex: number) => {
    const companyName = rows[rowIndex].cells[0].value.trim();
    
    if (!companyName) {
      return;
    }

    // Set loading state for the sentiment cell
    setRows(prevRows => {
      const newRows = [...prevRows];
      newRows[rowIndex].cells[1].isLoading = true;
      return newRows;
    });

    try {
      const data = await analyzeSentiment(companyName);
      
      setRows(prevRows => {
        const newRows = [...prevRows];
        newRows[rowIndex].cells[1].value = data.score.toFixed(2);
        newRows[rowIndex].cells[1].sentiment = data.score;
        newRows[rowIndex].cells[1].isLoading = false;
        return newRows;
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `Failed to analyze sentiment for ${companyName}`,
        variant: "destructive",
      });
      
      setRows(prevRows => {
        const newRows = [...prevRows];
        newRows[rowIndex].cells[1].isLoading = false;
        return newRows;
      });
    }
  };

  const handleBlur = async (rowIndex: number) => {
    setActiveCell(null);
    await analyzeSentimentForRow(rowIndex);
  };

  const addRow = () => {
    setRows((prevRows) => {
      const newRowIndex = prevRows.length;
      return [
        ...prevRows,
        {
          id: `row-${newRowIndex}`,
          cells: Array.from({ length: 2 }, (_, colIndex) => ({
            id: `cell-${newRowIndex}-${colIndex}`,
            value: "",
            isLoading: false,
          })),
        },
      ];
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <div style={{ position: "absolute", top: 10, left: 20 }}>
            <StaggeredDropdown options={dropdownOptions} />
          </div>

          <h2 className="text-2xl font-bold text-white">
            Company Sentiment Spreadsheet
          </h2>

          <Card className="p-4 bg-white/10 backdrop-blur-md border-white/10">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow ring-1 ring-white/20 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-white/10 border-collapse">
                    <thead>
                      <tr className="bg-white/5">
                        <th className="px-3 py-3 text-left text-sm font-semibold text-white/90 border-r border-white/10">
                          Company Name
                        </th>
                        <th className="px-3 py-3 text-left text-sm font-semibold text-white/90 border-r border-white/10">
                          Sentiment Score
                        </th>
                        <th className="px-3 py-3 text-left text-sm font-semibold text-white/90">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {rows.map((row, rowIndex) => (
                        <tr key={row.id} className="bg-white/5">
                          {row.cells.map((cell, cellIndex) => (
                            <td
                              key={cell.id}
                              className="whitespace-nowrap px-3 py-2 text-sm border-r border-white/10 last:border-r-0"
                            >
                              {activeCell === cell.id ? (
                                <Input
                                  autoFocus
                                  value={cell.value}
                                  onChange={(e) =>
                                    handleCellChange(rowIndex, cellIndex, e.target.value)
                                  }
                                  onBlur={() => handleBlur(rowIndex)}
                                  className="w-full bg-white/10 border-white/20 text-white"
                                />
                              ) : (
                                <div
                                  onClick={() => handleCellClick(cell.id, cellIndex)}
                                  className={`min-h-[2rem] px-2 py-1 rounded ${
                                    cellIndex === 0 ? 'cursor-pointer hover:bg-white/10 text-white' : ''
                                  } ${
                                    cellIndex === 1 
                                      ? cell.sentiment && cell.sentiment > 0 
                                        ? 'text-green-400 font-medium'
                                        : cell.sentiment && cell.sentiment < 0
                                          ? 'text-red-400 font-medium'
                                          : 'text-white/60'
                                      : ''
                                  }`}
                                >
                                  {cell.isLoading ? (
                                    <LoadingSpinner />
                                  ) : (
                                    cell.value || " "
                                  )}
                                </div>
                              )}
                            </td>
                          ))}
                          <td className="whitespace-nowrap px-3 py-2 text-sm">
                            {rows[rowIndex].cells[0].value && !rows[rowIndex].cells[1].isLoading && (
                              <Link 
                                href={`/dashboard?company=${encodeURIComponent(rows[rowIndex].cells[0].value)}`}
                              >
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                                >
                                  Go to Full Analysis
                                </Button>
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button 
                onClick={addRow} 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Add Row
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
