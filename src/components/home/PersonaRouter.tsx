"use client";

import { trpc } from "@/lib/trpc";
import { AthleteHome } from "./AthleteHome";
import { FanHome } from "./FanHome";
import { OrganizerHome } from "./OrganizerHome";
import { BrandHome } from "./BrandHome";

const personaComponents: Record<string, React.ComponentType> = {
  athlete: AthleteHome,
  fan: FanHome,
  bettor: FanHome,
  organizer: OrganizerHome,
  brand: BrandHome,
};

export function PersonaRouter() {
  const user = trpc.user.me.useQuery(undefined, { retry: false });

  if (user.isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton loading */}
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const userRoles = user.data?.roles?.map((r: { role: string }) => r.role) ?? [];
  const primaryRole = userRoles[0] ?? "athlete";

  const HomeComponent = personaComponents[primaryRole] ?? AthleteHome;

  const firstName = user.data?.name?.split(" ")[0] ?? "Atleta";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Olá, {firstName}!
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Veja o que está acontecendo no mundo do esporte.
        </p>
      </div>
      <HomeComponent />
    </div>
  );
}
