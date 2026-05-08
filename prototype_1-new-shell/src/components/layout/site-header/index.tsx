import { SidebarTrigger } from "@/components/ui/sidebar";

function SiteHeader() {
  return (
    <header className="flex w-full h-14 justify-between items-center gap-4 px-4 border-b">
      <SidebarTrigger />
    </header>
  );
}

export { SiteHeader };
