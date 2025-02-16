import { SpreadsheetDashboard } from "@/components/ui/spreadsheet-dashboard";

export default function SpreadsheetPage() {
  return (
    <main className="min-h-screen py-8">
      <div className="container">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Interactive Spreadsheet
        </h1>
        <SpreadsheetDashboard />
      </div>
    </main>
  );
}
