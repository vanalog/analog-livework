import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Shield, Users, Eye, Edit, Trash2 } from "lucide-react"

const roles = [
  {
    id: 1,
    name: "Administrator",
    description: "Full system access and user management",
    userCount: 2,
    permissions: {
      entityManagement: "full",
      contractReview: "full",
      financialOps: "full",
      userManagement: "full",
      systemSettings: "full",
    },
  },
  {
    id: 2,
    name: "Compliance Officer",
    description: "Contract review and compliance oversight",
    userCount: 3,
    permissions: {
      entityManagement: "read",
      contractReview: "full",
      financialOps: "read",
      userManagement: "none",
      systemSettings: "none",
    },
  },
  {
    id: 3,
    name: "Financial Operator",
    description: "Transaction and account management",
    userCount: 2,
    permissions: {
      entityManagement: "read",
      contractReview: "read",
      financialOps: "full",
      userManagement: "none",
      systemSettings: "none",
    },
  },
  {
    id: 4,
    name: "Viewer",
    description: "Read-only access to platform data",
    userCount: 5,
    permissions: {
      entityManagement: "read",
      contractReview: "read",
      financialOps: "read",
      userManagement: "none",
      systemSettings: "none",
    },
  },
]

const permissionLabels = {
  entityManagement: "Entity Management",
  contractReview: "Contract Review",
  financialOps: "Financial Operations",
  userManagement: "User Management",
  systemSettings: "System Settings",
}

export function AccessControlSettings() {
  const getPermissionBadge = (permission: string) => {
    switch (permission) {
      case "full":
        return <Badge>Full Access</Badge>
      case "read":
        return <Badge variant="secondary">Read Only</Badge>
      case "none":
        return <Badge variant="outline">No Access</Badge>
      default:
        return <Badge variant="outline">No Access</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Access Control</h1>
          <p className="text-muted-foreground">Manage user roles and permissions across the platform</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Role
        </Button>
      </div>

      {/* Roles Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <Badge variant="outline">{role.userCount} users</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium mb-1">{role.name}</h3>
              <p className="text-xs text-muted-foreground">{role.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Roles and Permissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
          <CardDescription>Configure access levels for different user roles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Entity Management</TableHead>
                <TableHead>Contract Review</TableHead>
                <TableHead>Financial Ops</TableHead>
                <TableHead>User Management</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{role.name}</div>
                      <div className="text-xs text-muted-foreground">{role.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {role.userCount}
                    </div>
                  </TableCell>
                  <TableCell>{getPermissionBadge(role.permissions.entityManagement)}</TableCell>
                  <TableCell>{getPermissionBadge(role.permissions.contractReview)}</TableCell>
                  <TableCell>{getPermissionBadge(role.permissions.financialOps)}</TableCell>
                  <TableCell>{getPermissionBadge(role.permissions.userManagement)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {role.name !== "Administrator" && (
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Permission Details */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Settings</CardTitle>
          <CardDescription>Configure specific permissions for the selected role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(permissionLabels).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">
                  {key === "entityManagement" && "Create, edit, and manage athlete, sponsor, and university profiles"}
                  {key === "contractReview" && "Review, approve, and manage NIL contracts and agreements"}
                  {key === "financialOps" && "Process payments, manage accounts, and handle transactions"}
                  {key === "userManagement" && "Create and manage user accounts and role assignments"}
                  {key === "systemSettings" && "Configure platform settings and system preferences"}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch id={`${key}-read`} />
                  <label htmlFor={`${key}-read`} className="text-xs">
                    Read
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id={`${key}-write`} />
                  <label htmlFor={`${key}-write`} className="text-xs">
                    Write
                  </label>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <Button>Save Permission Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
