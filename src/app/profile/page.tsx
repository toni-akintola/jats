import { UserProfile } from "@/components/user-profile";

export default function ProfilePage() {
  return (
    <main className="min-h-screen py-8">
      <div className="container">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">
          For You
        </h1>
        <UserProfile />
      </div>
    </main>
  );
}
