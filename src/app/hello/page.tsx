"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function HelloPage() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/set-name", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const { result } = await response.json();
      router.push(`/loading?name=${encodeURIComponent(result)}`);
    }
  };

  return (
    <main className="flex items-center justify-center h-screen -mt-16">
      <div className="absolute inset-0 bg-black/5" />
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/10 relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-white text-center">
          Welcome to PropAI
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-white/90 mb-3"
            >
              What&apos;s your name?
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              required
              className="w-full bg-white/5 border-white/20 text-white text-lg placeholder:text-white/40 h-12"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-lg font-medium text-white/90 mb-3"
            >
              Where are you located?
            </label>
            <Input
              type="text"
              name="location"
              id="location"
              required
              className="w-full bg-white/5 border-white/20 text-white text-lg placeholder:text-white/40 h-12"
              placeholder="Enter your location"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 text-lg font-medium bg-white/20 hover:bg-white/30 text-white border border-white/20"
          >
            Continue →
          </Button>
        </form>
      </div>
    </main>
  );
}
