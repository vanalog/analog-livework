import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertTriangle, User, Send, Shield } from "lucide-react"

interface WorkflowTrackingProps {
  workflowType: "Onboarding" | "Vetting" | "Disbursement"
}

const workflowData = {
  Onboarding: {
    description: "Track entity onboarding from creation to approval",
    steps: ["Entity Created", "KYC Submitted", "KYB Completed", "Approved"],
    icon: User,
    workflows: [
      {
        id: 1,
        entity: "Marcus Johnson",
        currentStep: 3,
        status: "approved",
        startDate: "2024-01-10",
        completedDate: "2024-01-15",
      },
      {
        id: 2,
        entity: "Sarah Williams",
        currentStep: 2,
        status: "in_progress",
        startDate: "2024-01-12",
        completedDate: null,
      },
      {
        id: 3,
        entity: "Local Auto Dealership",
        currentStep: 1,
        status: "pending",
        startDate: "2024-01-14",
        completedDate: null,
      },
    ],
  },
  Vetting: {
    description: "AI-powered contract analysis and approval workflow",
    steps: ["Contract Uploaded", "AI Evaluated", "Manual Review", "Approved/Flagged"],
    icon: Shield,
    workflows: [
      {
        id: 1,
        entity: "NIL_Marcus_Johnson.pdf",
        currentStep: 3,
        status: "approved",
        startDate: "2024-01-15",
        completedDate: "2024-01-15",
      },
      {
        id: 2,
        entity: "Sponsorship_Sarah_Williams.pdf",
        currentStep: 2,
        status: "flagged",
        startDate: "2024-01-14",
        completedDate: null,
      },
      {
        id: 3,
        entity: "NIL_David_Chen.pdf",
        currentStep: 1,
        status: "in_progress",
        startDate: "2024-01-13",
        completedDate: null,
      },
    ],
  },
  Disbursement: {
    description: "Payment processing from contract signing to fund transfer",
    steps: ["Contract Signed", "Funds Scheduled", "Payment Processed", "Funds Sent"],
    icon: Send,
    workflows: [
      {
        id: 1,
        entity: "Payment to Marcus Johnson",
        currentStep: 3,
        status: "completed",
        startDate: "2024-01-15",
        completedDate: "2024-01-15",
      },
      {
        id: 2,
        entity: "Payment to Sarah Williams",
        currentStep: 2,
        status: "in_progress",
        startDate: "2024-01-14",
        completedDate: null,
      },
      {
        id: 3,
        entity: "Payment to David Chen",
        currentStep: 1,
        status: "pending",
        startDate: "2024-01-13",
        completedDate: null,
      },
    ],
  },
}

export function WorkflowTracking({ workflowType }: WorkflowTrackingProps) {
  const data = workflowData[workflowType]
  const IconComponent = data.icon

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
        return "default"
      case "in_progress":
        return "secondary"
      case "pending":
        return "outline"
      case "flagged":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "flagged":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <IconComponent className="w-8 h-8" />
          {workflowType} Workflows
        </h1>
        <p className="text-muted-foreground">{data.description}</p>
      </div>

      {/* Workflow Steps Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Steps</CardTitle>
          <CardDescription>Standard process flow for {workflowType.toLowerCase()} workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {data.steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium mt-2 text-center max-w-24">{step}</p>
                </div>
                {index < data.steps.length - 1 && <div className="w-16 h-px bg-border mx-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Workflows */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Workflows</h2>
        {data.workflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(workflow.status)}
                  <div>
                    <h3 className="font-medium">{workflow.entity}</h3>
                    <p className="text-sm text-muted-foreground">
                      Started {new Date(workflow.startDate).toLocaleDateString()}
                      {workflow.completedDate &&
                        ` • Completed ${new Date(workflow.completedDate).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <Badge variant={getStatusColor(workflow.status)}>{workflow.status.replace("_", " ")}</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {workflow.currentStep} of {data.steps.length} steps
                  </span>
                </div>
                <Progress value={(workflow.currentStep / data.steps.length) * 100} />

                <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                  {data.steps.map((step, index) => (
                    <span
                      key={index}
                      className={`${
                        index < workflow.currentStep
                          ? "text-primary font-medium"
                          : index === workflow.currentStep
                            ? "text-foreground font-medium"
                            : ""
                      }`}
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
