import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit, Mail, Phone, Calendar, Building } from "lucide-react"

export function ProfileSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                <AvatarFallback className="text-lg">KV</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Change Photo
                </Button>
                <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Kevin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Volkel" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input id="email" defaultValue="kevin@analog.com" className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input id="phone" defaultValue="+1 (555) 123-4567" className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input id="dob" defaultValue="1990-05-15" type="date" className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input id="title" defaultValue="Platform Administrator" className="pl-10" />
                </div>
              </div>
            </div>

            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Your role and account status information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Role</span>
                <Badge>Administrator</Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Account Status</span>
                <Badge variant="default">Active</Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Member Since</span>
                <span className="text-sm text-muted-foreground">January 2024</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Last Login</span>
                <span className="text-sm text-muted-foreground">2 hours ago</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Permissions</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Entity Management</span>
                  <Badge variant="outline">Full Access</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Contract Review</span>
                  <Badge variant="outline">Full Access</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Financial Operations</span>
                  <Badge variant="outline">Full Access</Badge>
                </div>
                <div className="flex justify-between">
                  <span>User Management</span>
                  <Badge variant="outline">Full Access</Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              <Button variant="outline" className="w-full">
                Two-Factor Authentication
              </Button>
              <Button variant="destructive" className="w-full">
                Deactivate Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
