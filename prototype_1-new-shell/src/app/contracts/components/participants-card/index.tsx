import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { PARTICIPANT_ROLE_LABELS } from "@/lib/constants";
import { getInitials } from "@/lib/formatters";
import { Participant } from "@/types/api-types";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { AddParticipant } from "./add-participant";
import { DeleteParticipant } from "./delete-participant";

export function ParticipantsCard(props: {
  onAdd(participant: Participant): void;
  onDelete(participant: Participant): void;
  participants?: Participant[];
}) {
  return (
    <div className="w-full lg:flex-[1]">
      <Card className="gap-2">
        <CardHeader>
          <CardTitle className="font-semibold text-base">
            Participants
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            All parties involved in this agreement
          </CardDescription>
          <CardAction>
            <AddParticipant onAdd={props.onAdd} />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {props.participants?.map((participant: Participant) => {
            const [emailPrefix, emailDomain] =
              participant.email?.split("@") ?? [];

            return (
              <Card
                key={participant.uuid}
                className="p-2 hover:bg-muted/50 group"
              >
                <div className="flex gap-3 justify-between">
                  <div className="flex gap-3 items-center min-w-0">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(
                          participant.first_name || "",
                          participant.last_name || "",
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-sm truncate">
                        {participant.first_name} {participant.last_name}
                      </span>
                      {participant.role && (
                        <span className="text-xs text-muted-foreground truncate">
                          {PARTICIPANT_ROLE_LABELS[participant.role]}
                        </span>
                      )}
                      {participant.email && (
                        <span className="text-xs text-muted-foreground flex min-w-0">
                          <span className="truncate">{emailPrefix}</span>
                          <span className="shrink-0">@{emailDomain}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <DeleteParticipant
                    participant={participant}
                    onDelete={props.onDelete}
                  />
                </div>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
