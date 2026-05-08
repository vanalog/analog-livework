import { Status } from "../components/beneficiary-status-badge";
import { Beneficiary } from "./types";

const beneficiary: Beneficiary = {
  uuid: "7865BC17-6DAE-49F7-A74D-EDA5683724C1",
  name: "Marcus Johnson",
  university: "University of Florida",
  status: "in-progress",
  totalValue: 12500000,
  contractCount: 3,
  compliance: {
    documents: [
      {
        uuid: "3DAC9550-0353-40F6-A63D-C981CD71847D",
        filename: "W-9_Marcus_Johnson.pdf",
        type: "W-9",
        date: "2024-01-09",
      },
      {
        uuid: "46F772C2-6927-4729-AA4A-02341927AB36",
        filename: "ID_Verification.pdf",
        type: "ID Verification",
        date: "2024-01-09",
      },
    ],
    kyc_statuses: {
      identity_verification: "in-progress" as Status,
      document_review: "completed" as Status,
      risk_assessment: 1,
    },
    compliance_flags: [
      {
        uuid: "3962DDA5-4133-412C-9331-84C3ED6E73B3",
        title: "Document Expiration Warning",
        detail: "Tax form expires in 30 days",
      },
    ],
  },
  activities: [
    {
      uuid: "ADB6493C-9805-4CF6-A4F4-401E91A55BDE",
      event: "Contract activated: Nike Endorsement Deal",
      timestamp: "2024-01-15T05:30:00Z",
    },
    {
      uuid: "A2D0B292-42DC-4B6B-B803-6B25AD0000BA",
      event: "KYC verification completed",
      timestamp: "2024-01-12T09:20:00Z",
    },
    {
      uuid: "AC7BEBF7-60B4-4BF3-B260-03B9FA3941FF",
      event: "Tax documents uploaded",
      timestamp: "2024-01-10T04:15:00Z",
    },
    {
      uuid: "19F70D54-3D14-4188-AF88-B377C2747960",
      event: "Beneficiary profile created",
      timestamp: "2024-01-08T11:45:00Z",
    },
  ],
};

export { beneficiary };
