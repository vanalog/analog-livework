import type { Metadata } from "next";
import { SportsManager } from "./_components/sports-manager";
import { ConferencesManager } from "./_components/conferences-manager";

export const metadata: Metadata = {
  title: "Taxonomy Settings",
  description: "Manage the canonical list of sports and conferences.",
  robots: { index: false, follow: false },
};

export default function TaxonomySettingsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Taxonomy Settings
        </h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Manage the canonical list of sports and conferences used across the
          platform. Changes here affect every dropdown and saved record. This
          page is unlisted — share the URL only with admins who need it.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <SportsManager />
        <ConferencesManager />
      </div>
    </main>
  );
}
