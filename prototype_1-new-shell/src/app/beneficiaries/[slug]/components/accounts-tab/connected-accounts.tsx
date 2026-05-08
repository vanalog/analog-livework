import { HTMLAttributes } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { ConnectedAccount } from ".";
import { cn } from "@/lib/utils";

interface ConnectedAccountsProps extends HTMLAttributes<HTMLDivElement> {
  external_accounts: ConnectedAccount[];
}

function ConnectedAccounts(props: ConnectedAccountsProps) {
  return (
    <Card className={cn(props.className, "shadow-none")}>
      <CardHeader>
        <CardTitle className="flex flex-col md:flex-row justify-between">
          <h3 className="text-2xl font-semibold flex items-center gap-2 mb-4 lg:mb-0">
            <CreditCard />
            Connected Accounts
          </h3>
          <Button>
            <Plus />
            Add External Account
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Switch />
          <label className="text-sm font-medium">
            Auto-distribute released funds to default account
          </label>
        </div>
        <Separator className="my-4" />
        {props.external_accounts.map((account) => {
          return (
            <Card key={account.uuid} className="shadow-none p-4 mb-4 last:mb-0">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 w-full">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <div className="w-full">
                    <div className="flex gap-4">
                      <p className="font-medium">
                        {account.institution} •••• {account.last_four}
                      </p>
                      {account.is_default && (
                        <Badge
                          variant="secondary"
                          className="rounded-full font-semibold"
                        >
                          <Star /> Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">
                      {account.type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {account.name}
                    </p>
                  </div>
                  {account.is_default === false && (
                    <Button variant="outline">Make Default</Button>
                  )}
                  <Button variant="outline" className="shadow-none">
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}

export { ConnectedAccounts };
