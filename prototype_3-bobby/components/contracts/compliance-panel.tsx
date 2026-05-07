"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, AlertTriangle, AlertCircle, Lightbulb, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ComplianceItem {
  id: string
  type: "verified" | "review" | "conflict" | "suggestion"
  title: string
  excerpt: string
  location: string
  description: string
}

const mockComplianceData: ComplianceItem[] = [
  {
    id: "1",
    type: "verified",
    title: "Payment Terms Compliant",
    excerpt: "Net 30 payment terms align with standard commercial practices...",
    location: "Section 4.2, Page 3",
    description: "Payment terms of Net 30 days comply with company policy and industry standards.",
  },
  {
    id: "2",
    type: "conflict",
    title: "Liability Cap Exceeds Policy",
    excerpt: "Liability limited to $500,000 per incident...",
    location: "Section 8.1, Page 7",
    description:
      "The liability cap of $500,000 exceeds the company's standard maximum of $250,000. Legal review required.",
  },
  {
    id: "3",
    type: "review",
    title: "Termination Clause Needs Review",
    excerpt: "Either party may terminate with 60 days notice...",
    location: "Section 12.3, Page 11",
    description: "Termination notice period is longer than typical 30-day standard. Consider negotiation.",
  },
  {
    id: "4",
    type: "verified",
    title: "Confidentiality Terms Standard",
    excerpt: "Confidential information shall be protected for 5 years...",
    location: "Section 9.1, Page 8",
    description: "Confidentiality obligations meet company requirements and industry best practices.",
  },
  {
    id: "5",
    type: "suggestion",
    title: "Consider Adding Force Majeure",
    excerpt: "No force majeure clause detected...",
    location: "N/A",
    description: "Adding a force majeure clause would protect against unforeseen circumstances.",
  },
]

const typeConfig = {
  verified: {
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
    label: "Verified",
    badgeVariant: "default" as const,
  },
  review: {
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/10",
    label: "Need Review",
    badgeVariant: "secondary" as const,
  },
  conflict: {
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    label: "Conflict",
    badgeVariant: "destructive" as const,
  },
  suggestion: {
    icon: Lightbulb,
    color: "text-primary",
    bgColor: "bg-primary/10",
    label: "Suggestion",
    badgeVariant: "outline" as const,
  },
}

export function CompliancePanel() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const stats = {
    verified: mockComplianceData.filter((item) => item.type === "verified").length,
    review: mockComplianceData.filter((item) => item.type === "review").length,
    conflict: mockComplianceData.filter((item) => item.type === "conflict").length,
    suggestion: mockComplianceData.filter((item) => item.type === "suggestion").length,
  }

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Permissibility Review</CardTitle>
          <div className="mt-4 flex flex-wrap gap-3">
            <Badge variant="default" className="bg-success text-success-foreground">
              {stats.verified} Verified
            </Badge>
            <Badge variant="secondary" className="bg-warning text-warning-foreground">
              {stats.review} Need Review
            </Badge>
            <Badge variant="destructive">{stats.conflict} Conflicts</Badge>
            <Badge variant="outline">{stats.suggestion} Suggestions</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockComplianceData.map((item, index) => {
              const config = typeConfig[item.type]
              const Icon = config.icon
              const isExpanded = expandedItems.has(item.id)

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Collapsible open={isExpanded} onOpenChange={() => toggleItem(item.id)}>
                    <div
                      className={`rounded-lg border border-border bg-card transition-all hover:border-primary/50 ${
                        isExpanded ? "ring-2 ring-primary/20" : ""
                      }`}
                    >
                      <CollapsibleTrigger asChild>
                        <button className="w-full p-4 text-left">
                          <div className="flex items-start gap-3">
                            <div className={`rounded-lg ${config.bgColor} p-2`}>
                              <Icon className={`h-4 w-4 ${config.color}`} />
                            </div>
                            <div className="flex-1">
                              <div className="mb-1 flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-card-foreground">{item.title}</h4>
                                {isExpanded ? (
                                  <ChevronUp className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {item.location}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </button>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="border-t border-border bg-muted/30 p-4">
                          <p className="mb-4 text-sm text-card-foreground">{item.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="default">
                              Mark as Reviewed
                            </Button>
                            <Button size="sm" variant="outline">
                              Send to Legal
                            </Button>
                            <Button size="sm" variant="ghost">
                              Add Note
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
