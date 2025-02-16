import Listings from "@/components/listings";

export default function DashboardPage() {
  return (
    <main className="min-h-screen py-8">
      <div className="container">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">
          Your Listings
        </h1>
        <Listings initialListings={[]} />
      </div>
    </main>
  );
}
