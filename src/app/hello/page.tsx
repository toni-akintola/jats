'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function HelloPage() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await fetch('/api/set-name', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <main 
      className="min-h-screen flex items-center justify-center relative"
      style={{
        background: `linear-gradient(135deg, 
          #0e3b5c 0%,
          #5e4f6d 25%,
          #9f6671 50%,
          #d8897b 75%,
          #f4ac7b 100%
        )`,
      }}
    >
      <div className="absolute inset-0 bg-black/5" />
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/10 relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-white text-center">
          Welcome to Feels!
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-white/90 mb-3">
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
