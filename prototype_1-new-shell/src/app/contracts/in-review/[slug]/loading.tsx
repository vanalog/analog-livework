import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col space-y-4">
      {/* Title Section Skeleton */}
      <div className="flex gap-3 w-full justify-between items-start flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="ghost" disabled>
            <ArrowLeft />
          </Button>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-96" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
      </div>

      {/* Progress Card Skeleton */}
      <Card className="p-6 pt-10">
        <div className="hidden lg:flex items-start">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className="flex items-start flex-1 last:flex-none">
              <div className="flex flex-col items-center w-20 gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
              {step < 6 && <Skeleton className="flex-1 h-0.5 mt-4" />}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-0 lg:hidden">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step}>
              <div className="flex items-center gap-4">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <Skeleton className="h-4 w-32" />
              </div>
              {step < 6 && (
                <div className="flex">
                  <div className="w-8 flex justify-center">
                    <Skeleton className="w-0.5 h-8" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Summary Card Skeleton */}
      <Card className="p-6 py-10">
        <div className="flex justify-between h-full flex-wrap gap-4">
          {[1, 2, 3].map((col) => (
            <div key={col} className="flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Version History & Notes */}
        <div className="lg:col-span-2 space-y-4">
          {/* Version History Skeleton */}
          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-4">
                    <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Notes Skeleton */}
          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-3">
                {[1, 2].map((item) => (
                  <div key={item} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Participants & Quick Actions */}
        <div className="space-y-4">
          {/* Participants Skeleton */}
          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Quick Actions Skeleton */}
          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
