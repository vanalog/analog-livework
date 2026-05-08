"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  DollarSign,
  FileText,
  Mail,
  Upload,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./components/overview-tab";
import { ContractsTab } from "./components/contracts-tab";
import { PayoutsTab } from "./components/payouts-tab";
import { AccountsTab } from "./components/accounts-tab";
import { ComplianceTab } from "./components/compliance-tab";
import { ActivityTab } from "./components/activity-tab";
import { BeneficiaryStatusBadge } from "../components/beneficiary-status-badge";
import { formatCentstoUSD } from "@/lib/formatters";
import { beneficiary } from "./data";

interface BeneficiaryProps {
  params: Promise<{ slug: string }>;
}

function Beneficiary(props: BeneficiaryProps) {
  const resolvedParams = React.use(props.params);
  const { slug } = resolvedParams;

  console.log({ slug });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href="/beneficiaries">
            <ArrowLeft />
            Back to beneficiaries
          </Link>
        </Button>
      </div>
      <div className="flex gap-4 justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{beneficiary.name}</h1>
          <div className="text-muted-foreground">
            Beneficiary profile and compliance status
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">
            <Mail /> Send KYC Invite
          </Button>
          <Button variant="outline">
            <Upload /> Upload Tax Form
          </Button>
        </div>
      </div>
      <div className="flex gap-4">
        <Badge variant="outline" className="rounded-full font-semibold">
          <Users className="mr-1" />
          {beneficiary.university}
        </Badge>
        <BeneficiaryStatusBadge status={beneficiary.status} />
        <Badge variant="outline" className="rounded-full font-semibold">
          <DollarSign />
          {formatCentstoUSD(beneficiary.totalValue)} Total Value
        </Badge>
        <Badge variant="outline" className="rounded-full font-semibold">
          <FileText />
          {beneficiary.contractCount} Contracts
        </Badge>
      </div>
      <div>
        <Tabs defaultValue="overview">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="contracts">
            <ContractsTab />
          </TabsContent>
          <TabsContent value="payouts">
            <PayoutsTab />
          </TabsContent>
          <TabsContent value="accounts">
            <AccountsTab />
          </TabsContent>
          <TabsContent value="compliance">
            <ComplianceTab compliance={beneficiary.compliance} />
          </TabsContent>
          <TabsContent value="activity">
            <ActivityTab activities={beneficiary.activities} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Beneficiary;
