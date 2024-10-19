import * as React from "react";
import { ChevronsLeftRightEllipsis, EthernetPort, Github } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { dnsTypes } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

const data = {
  navMain: [
    {
      title: "DNS",
      url: "/dns",
      icon: EthernetPort,
      isActive: true,
      items: dnsTypes.map((type) => ({
        title: type.toUpperCase(),
        url: `/dns/${type}`,
      })),
    },
  ],
  navSecondary: [
    {
      title: "GitHub",
      url: "https://github.com/jac00000b/network-utility",
      icon: Github,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <ChevronsLeftRightEllipsis className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Network Utility
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
