import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { HomeIcon, LibraryBig, PlusIcon } from "lucide-react";

export function ThreadSidebar() {
  return (
    <Sidebar className="border-r border-gray-200 bg-accent dark:border-gray-800 dark:bg-gray-900 lg:bg-gray-50 lg:dark:bg-gray-900/50">
      <SidebarHeader>
        <div className="flex w-full items-center justify-between border-b">
          <Link
            href={"/"}
            passHref
            className="select-none p-2"
            aria-label="Home"
          >
            Logo
          </Link>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="gap-2">
          <Link
            href={"/new"}
            className={cn(
              buttonVariants({
                variant: "outline",
              })
            )}
            prefetch={false}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            <span>New chat</span>
          </Link>
        </SidebarGroup>
        <SidebarGroup className="space-y-2">
          <Link
            href={"/"}
            className={cn(
              buttonVariants({
                variant: "link",
                className:
                  "flex w-full items-center justify-start text-base font-normal hover:underline",
              })
            )}
          >
            <HomeIcon className="mr-2 size-5" />
            <span>Home</span>
          </Link>

          <Link
            href={"/chat"}
            className={cn(
              buttonVariants({
                variant: "link",
                className:
                  "flex w-full items-center justify-start text-base font-normal hover:underline",
              })
            )}
          >
            <LibraryBig className="mr-2 size-5" />
            <span>History</span>
          </Link>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-end gap-2"></div>
      </SidebarFooter>
    </Sidebar>
  );
}
