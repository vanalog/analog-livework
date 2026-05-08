import { EllipsisVertical, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateShort } from "@/lib/formatters";
import { ReadThreadResponse } from "@/types/api-types";
import { useDocumentDownload } from "../../hooks/use-document-download";
import { CURRENT_HOLDER_LABELS } from "@/lib/constants";

function InReviewVersionHistory(props: ReadThreadResponse) {
  const { handleDownload } = useDocumentDownload();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Version History</h2>
      <div className="flex flex-col gap-2">
        {props.posts?.map((post, index, array) => {
          const isMostRecent = index === 0;

          return (
            <div key={post.uuid} className="relative group">
              <div className="absolute left-3 -bottom-2 w-0.5 h-2 bg-gray-300 z-0 translate-x-[3px] group-last:hidden" />
              <Card
                className={`p-3 ${isMostRecent && "border-blue-200 bg-blue-50/50"}`}
              >
                <div className="flex justify-between items-center overflow-x-auto lg:overflow-x-hidden">
                  <div className="flex gap-4 items-center">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${isMostRecent ? "bg-blue-500" : "bg-red-500"} shrink-0`}
                    />
                    <span
                      className={`text-sm ${isMostRecent && "font-semibold text-blue-700"}`}
                    >
                      v{array.length - index}
                    </span>
                    <span className="text-sm truncate">
                      {post.documents
                        ? post.documents[0]?.filename
                        : props.title}
                    </span>
                    {isMostRecent && (
                      <Badge className="bg-blue-600 font-medium">CURRENT</Badge>
                    )}
                    <span className="text-xs text-muted-foreground shrink-0">
                      {post.current_holder &&
                        CURRENT_HOLDER_LABELS[post.current_holder]}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {post.posted_at && formatDateShort(post.posted_at)}
                    </span>
                  </div>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        <EllipsisVertical size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuGroup>
                          {post.documents && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleDownload(
                                  props.uuid,
                                  post.documents?.[0]?.uuid,
                                )
                              }
                            >
                              <Download size={16} />
                              Download
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { InReviewVersionHistory };
