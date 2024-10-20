import { createLazyFileRoute } from "@tanstack/react-router";
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
import { useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createLazyFileRoute("/ip-info")({
  component: IpInfo,
});

function IpInfo() {
  const { data, isLoading } = useQuery({
    queryKey: ["ip-info"],
    queryFn: async () => {
      const response = await ofetch.raw("https://loc.jacob.com.hk");
      return {
        ip: response.headers.get("x-ip"),
        as: response.headers.get("x-asnum"),
        city: response.headers.get("x-city"),
        region: response.headers.get("x-region"),
        country: response.headers.get("x-country"),
      };
    },
  });

  if (isLoading || !data) return null;

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
                  <BreadcrumbLink href="/ip-info">IP Info</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="rounded-xl bg-muted/50 flex items-center justify-center py-16">
            <h1 className="text-4xl font-bold">{data.ip}</h1>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{data.city}</p>
                <p className="text-sm">{data.region}</p>
                <CardDescription>
                  {new Intl.DisplayNames("en", { type: "region" }).of(
                    data.country ?? ""
                  )}
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Autonomous System</p>
                <CardDescription>AS{data.as}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
