"use client";

import { InReviewTitle } from "@/app/contracts/in-review/[slug]/components/in-review-title";
import { InNegotiationProgress } from "@/app/contracts/in-review/[slug]/components/in-negotiation-progress";
import { InNegotiationSummary } from "@/app/contracts/in-review/[slug]/components/in-negotiation-summary";
import { InReviewVersionHistory } from "@/app/contracts/in-review/[slug]/components/in-review-version-history";
import { InReviewNotes } from "@/app/contracts/in-review/[slug]/components/in-review-notes";
import { InReviewQuickActions } from "@/app/contracts/in-review/[slug]/components/in-review-quick-actions";
import { useApi } from "@/lib/api";
import { useParams } from "next/navigation";
import Loading from "./loading";

function InNegotiationDetailPage() {
  const resolvedParams = useParams<{ slug: string }>();
  const { slug } = resolvedParams;
  const $api = useApi();

  const { data, isLoading } = $api.useQuery(
    "get",
    "/v1/threads/{thread_uuid}",
    {
      params: { path: { thread_uuid: slug } },
    },
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col space-y-4">
      <InReviewTitle
        student_athlete={data?.student_athlete}
        title={data?.title}
        agency={data?.agency}
        uuid={data?.uuid}
        is_priority={data?.is_priority}
      />
      {/*<InNegotiationTiming
        currentParty={contractNegotiationDetails.currentParty}
        days={contractNegotiationDetails.days}
      />*/}
      <InNegotiationProgress status={data?.status} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <InNegotiationSummary
            student_athlete={data?.student_athlete}
            agency={data?.agency}
            total_value={data?.total_value}
            start_date={data?.start_date}
            end_date={data?.end_date}
            contract_type={data?.contract_type}
            contract_group={data?.contract_group}
            status={data?.status}
            agreement={data?.agreement}
          />
          <InReviewVersionHistory
            uuid={data?.uuid}
            posts={data?.posts}
            title={data?.title}
          />
          <InReviewNotes uuid={data?.uuid} notes={data?.notes} />
        </div>
        <div className="space-y-4">
          <InReviewQuickActions thread={data} />
        </div>
      </div>
    </div>
  );
}

export default InNegotiationDetailPage;
