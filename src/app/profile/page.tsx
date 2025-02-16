import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileCard } from "@/components/profile/profile-card";

export default function ProfilePage() {
  return (
    <div className="py-16 max-h-full h-full min-h-screen">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Developer Profile
        </h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <ProfileCard />
          </div>
          <div className="md:col-span-2">
            <ProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
}
