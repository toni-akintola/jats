"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building2, MapPin, Trophy } from "lucide-react";

export function ProfileCard() {
  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader className="space-y-4">
        <div className="flex justify-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/avatar.png" alt="Profile" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold">John Developer</h2>
          <p className="text-sm text-white/60">Principal Developer</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white/80">
            <Building2 className="h-4 w-4" />
            <span>Urban Mixed-Use Specialist</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="h-4 w-4" />
            <span>San Francisco Bay Area</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Trophy className="h-4 w-4" />
            <span>15+ Years Experience</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
