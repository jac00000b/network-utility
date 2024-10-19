import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { dnsTypes } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronsLeftRightEllipsis } from "lucide-react";

export const Route = createLazyFileRoute("/dns/")({
  component: DnsPage,
});

function DnsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dns">DNS</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {dnsTypes.map((type) => (
              <Link to={`/dns/${type}`} key={type}>
                <Card className="md:aspect-video flex md:items-end">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <ChevronsLeftRightEllipsis className="size-8" />
                      <CardTitle>{type.toUpperCase()}</CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
