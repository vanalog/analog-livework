import { components } from "@/types/schema";

/* Agreements */
export type CreateAgreementRequest =
  components["schemas"]["http.CreateAgreementRequest"];
export type CreateAgreementResponse =
  components["schemas"]["http.CreateAgreementResponse"];
export type GetAgreementResponse =
  components["schemas"]["http.GetAgreementResponse"];
export type ScheduledPaymentResponse =
  components["schemas"]["http.scheduledPaymentResponse"];
export type AgreementPartyResponse =
  components["schemas"]["http.agreementPartyResponse"];
export type ExpandedBudgetPlan =
  components["schemas"]["http.ExpandedBudgetPlanResponse"];

/* Exchanges */
export type CreateExchangeRequest =
  components["schemas"]["http.CreateExchangeRequest"];
export type UpdateExchangeRequest =
  components["schemas"]["http.UpdateExchangeRequest"];
export type SwapObligationDatesRequest =
  components["schemas"]["http.SwapObligationDatesRequest"];

/* Contracts */
export type ContractStatus = "approved" | "under-review" | "rejected";
export type ContractType = components["schemas"]["domain.ContractType"];
export type ContractGroup = components["schemas"]["domain.ContractGroup"];
export type CurrentHolder = components["schemas"]["domain.CurrentHolder"];

/* Participants */
export type Participant = components["schemas"]["domain.Participant"];
export type ParticipantRole = components["schemas"]["domain.ParticipantRole"];

/* Student Athletes */
export type Sport = components["schemas"]["domain.Sport"];
export type StudentAthleteWithContracts =
  components["schemas"]["domain.StudentAthleteWithContracts"];
export type StudentAthleteResponse =
  components["schemas"]["http.GetStudentAthleteResponse"];

/* Extended Student Athlete with Threads (used in athlete detail page) */
export type StudentAthleteWithThreads = StudentAthleteResponse & {
  threads?: Thread[];
};

/* Threads */
export type Thread = components["schemas"]["domain.Thread"];
export type ThreadPost = components["schemas"]["domain.Post"];
export type ThreadStatus = components["schemas"]["domain.ThreadStatus"];
export type ThreadStatsResponse =
  components["schemas"]["http.ThreadsStatsResponse"];
export type ReadThreadResponse =
  components["schemas"]["http.ReadThreadResponse"];

/* GetUserResponse */
export type GetUserResponse = components["schemas"]["http.GetUserResponse"];

/* Workspaces */
export type Workspace = components["schemas"]["http.Workspace"];

/* Budgets */
export type BudgetPlanSummaryResponse =
  components["schemas"]["http.BudgetPlanSummaryResponse"];

/* Workspaces */
export type Workflow = components["schemas"]["http.WorkflowResponse"];

/* User */
export type AnalogUser = GetUserResponse & {
  sub?: string;
  name?: string;
  email?: string;
  nickname?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  preferred_workspace?: Workspace;
};
