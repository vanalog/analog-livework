import { ContactInformationCard } from "./contact-information-card";
import { UniversityAffliationCard } from "./university-affliation-card";
import { ComplianceStatusCard } from "./compliance-status-card";
import { RecentActivityCard } from "./recent-activity-card";

function OverviewTab() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      <div className="space-y-6 w-full">
        <ContactInformationCard />
        <UniversityAffliationCard />
      </div>
      <div className="space-y-6 w-full">
        <ComplianceStatusCard />
        <RecentActivityCard />
      </div>
    </div>
  );
}

export { OverviewTab };
