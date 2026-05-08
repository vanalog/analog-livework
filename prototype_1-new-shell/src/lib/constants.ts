import {
  type CurrentHolder,
  type ParticipantRole,
  type ThreadStatus,
  type ContractType,
  type ContractGroup,
  Sport,
} from "@/types/api-types";

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes

function toOptions<K extends string>(
  labels: Record<K, string>,
): { value: K; label: string }[] {
  return (Object.entries(labels) as [K, string][]).map(([value, label]) => ({
    value,
    label,
  }));
}

export const CURRENT_HOLDER_LABELS: Record<CurrentHolder, string> = {
  with_athlete: "With Athlete",
  with_athlete_legal: "With Athlete Legal",
  with_agent: "With Agent",
  with_university: "With University",
  with_university_legal: "With University Legal",
  all_parties: "Out for Signature",
  on_file: "On File",
};

export const PARTICIPANT_ROLE_LABELS: Record<ParticipantRole, string> = {
  student_agent: "Athlete Agent",
  student_counselor: "Athlete Counsel",
  student_parent: "Athlete Parent",
  university_counselor: "Legal Counsel",
  university_compliance: "Compliance",
  university_admin: "Administrator",
  other: "Other",
};

export const THREAD_STATUS_LABELS: Record<ThreadStatus, string> = {
  drafting: "Drafting",
  draft_sent: "Draft Sent",
  in_redlining: "In Redlining",
  ready_to_sign: "Ready to Sign",
  executed: "Executed",
  active: "Active",
  terminated: "Terminated",
  expired: "Expired",
  cancelled: "Cancelled",
};

export const THREAD_PRIORITY_LABELS: Record<string, string> = {
  true: "Flagged Only",
};

export const THREAD_STATUS_DESCRIPTIONS: Record<ThreadStatus, string> = {
  drafting: "Contract is being drafted and prepared for review",
  draft_sent: "Initial contract draft has been sent for review",
  in_redlining: "Contract is being actively negotiated and edited",
  ready_to_sign: "Contract is ready for signatures from all parties",
  executed: "Contract has been fully signed and is now active",
  active: "Contract is in effect and obligations are being fulfilled",
  terminated: "Contract has been terminated before completion",
  expired: "Contract has passed its expiration date",
  cancelled: "Contract has been cancelled and will not proceed",
};

export const SPORT_LABELS = {
  football: "Football",
  mens_basketball: "Men's Basketball",
  womens_basketball: "Women's Basketball",
  baseball: "Baseball",
  softball: "Softball",
  mens_soccer: "Men's Soccer",
  womens_soccer: "Women's Soccer",
  volleyball: "Volleyball",
  mens_tennis: "Men's Tennis",
  womens_tennis: "Women's Tennis",
  mens_golf: "Men's Golf",
  womens_golf: "Women's Golf",
  mens_swimming: "Men's Swimming & Diving",
  womens_swimming: "Women's Swimming & Diving",
  mens_track: "Men's Track & Field",
  womens_track: "Women's Track & Field",
  wrestling: "Wrestling",
  gymnastics: "Gymnastics",
  lacrosse: "Lacrosse",
  field_hockey: "Field Hockey",
  rowing: "Rowing",
  ice_hockey: "Ice Hockey",
  cross_country: "Cross Country",
  other: "Other",
} as const;

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  amendment: "Amendment",
  memo: "Memo",
  revenue_share: "Revenue Share",
  termination_notice: "Termination Notice",
  third_party_nil: "Third Party NIL",
  ioi: "Indication of Interest",
};

export const CONTRACT_GROUP_LABELS: Record<ContractGroup, string> = {
  new_recruit: "New Recruit",
  transfer: "Transfer",
  retention: "Retention",
  termination: "Termination",
};

const SUFFIX_LABELS: Record<string, string> = {
  "Jr.": "Jr.",
  "Sr.": "Sr.",
  II: "II",
  III: "III",
  IV: "IV",
};

export const currentHolderOptions = toOptions(CURRENT_HOLDER_LABELS);
export const contractTypeOptions = toOptions(CONTRACT_TYPE_LABELS);
export const contractGroupOptions = toOptions(CONTRACT_GROUP_LABELS);
export const participantRoleOptions = toOptions(PARTICIPANT_ROLE_LABELS);
export const threadStatusOptions = toOptions(THREAD_STATUS_LABELS);
export const sportOptions = toOptions(SPORT_LABELS);
export const suffixOptions = toOptions(SUFFIX_LABELS);

export const CURRENT_HOLDER_VALUES = Object.keys(
  CURRENT_HOLDER_LABELS,
) as CurrentHolder[];

export const PARTICIPANT_ROLE_VALUES = Object.keys(
  PARTICIPANT_ROLE_LABELS,
) as ParticipantRole[];

export const THREAD_STATUS_VALUES = Object.keys(
  THREAD_STATUS_LABELS,
) as ThreadStatus[];

export const SPORT_VALUES = Object.keys(SPORT_LABELS) as Sport[];

export const CONTRACT_TYPE_VALUES = Object.keys(
  CONTRACT_TYPE_LABELS,
) as ContractType[];

export const CONTRACT_GROUP_VALUES = Object.keys(
  CONTRACT_GROUP_LABELS,
) as ContractGroup[];

export const SUFFIX_VALUES = Object.keys(SUFFIX_LABELS) as string[];
