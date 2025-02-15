import { SentimentDashboard } from "@/components/sentiment-dashboard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen py-8">
      <div className="container">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Company Sentiment Analysis
        </h1>
        <SentimentDashboard />
      </div>
    </main>
  );
}
