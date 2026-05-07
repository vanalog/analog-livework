import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, Bell, Shield, Database } from "lucide-react"

export function GeneralSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure platform preferences and system settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive platform notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Email Notifications</div>
                  <div className="text-xs text-muted-foreground">Receive updates via email</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Contract Alerts</div>
                  <div className="text-xs text-muted-foreground">Notify when contracts need review</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Payment Notifications</div>
                  <div className="text-xs text-muted-foreground">Alerts for payment processing</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Compliance Alerts</div>
                  <div className="text-xs text-muted-foreground">KYC/KYB and regulatory notifications</div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
            <CardDescription>Manage security and authentication settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Two-Factor Authentication</div>
                  <div className="text-xs text-muted-foreground">Add an extra layer of security</div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Session Timeout</div>
                  <div className="text-xs text-muted-foreground">Auto-logout after inactivity</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Login Alerts</div>
                  <div className="text-xs text-muted-foreground">Notify on new device login</div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              <Button variant="outline" className="w-full">
                Download Backup Codes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Platform
            </CardTitle>
            <CardDescription>General platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="America/New_York" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Input id="currency" defaultValue="USD" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input id="language" defaultValue="English (US)" />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Maintenance Mode</div>
                  <div className="text-xs text-muted-foreground">Temporarily disable platform access</div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Debug Mode</div>
                  <div className="text-xs text-muted-foreground">Enable detailed error logging</div>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Integrations
            </CardTitle>
            <CardDescription>Configure external service connections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Banking API</div>
                  <div className="text-xs text-muted-foreground">Connected to payment processor</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">KYC Provider</div>
                  <div className="text-xs text-muted-foreground">Identity verification service</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Email Service</div>
                  <div className="text-xs text-muted-foreground">Notification delivery system</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">AI Contract Analysis</div>
                  <div className="text-xs text-muted-foreground">Document processing service</div>
                </div>
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Manage Integrations
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
