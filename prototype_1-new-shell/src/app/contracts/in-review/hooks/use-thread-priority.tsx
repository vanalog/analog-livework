import { toast } from "sonner";

// Mock hook for prototype - just shows a toast
function useThreadPriority() {
  function togglePriority(uuid?: string, isPriority?: boolean) {
    if (uuid == null || isPriority == null) {
      toast.error("Failed to update priority. Please try again.");
      return;
    }

    // In prototype mode, just show a toast
    toast.success(`Priority ${isPriority ? "removed" : "added"} (prototype mode)`);
  }

  return { togglePriority, isPending: false };
}

export { useThreadPriority };
