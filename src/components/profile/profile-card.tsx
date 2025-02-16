"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building2, MapPin, Trophy } from "lucide-react";
import { useProfileStore } from "@/store/profile-store";

export function ProfileCard() {
  const profile = useProfileStore((state) => state.profile);

  if (!profile) return null;

  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader className="space-y-4">
        <div className="flex justify-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.imageUrl} alt={profile.name} />
            <AvatarFallback>
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="text-sm text-white/60">{profile.title}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white/80">
            <Building2 className="h-4 w-4" />
            <span>{profile.specialization.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="h-4 w-4" />
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Trophy className="h-4 w-4" />
            <span>{profile.experience}+ Years Experience</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
