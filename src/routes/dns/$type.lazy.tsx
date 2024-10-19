import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { dnsTypes, dohServers } from "@/lib/utils";
import { createLazyFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormDescription, FormField } from "@/components/ui/form";
import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";

export const Route = createLazyFileRoute("/dns/$type")({
  component: DnsTypePage,
});

const formSchema = z.object({
  domain: z
    .string()
    .regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/, {
      message: "Please enter a valid domain name",
    }),
});

function DnsTypePage() {
  const { type } = Route.useParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
    },
  });

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["dnsData", type, form.getValues("domain")],
    queryFn: async () => {
      const result = await Promise.all(
        dohServers.map(async (server) => ({
          ...server,
          response: await ofetch(server.url, {
            headers: {
              accept: "application/dns-json",
            },
            query: {
              name: form.getValues("domain"),
              type: type.toUpperCase(),
            },
            responseType: "json",
            cache: "no-cache",
          }),
        }))
      );
      return result;
    },
    enabled: false,
  });

  if (
    !dnsTypes.includes(
      //@ts-expect-error
      type
    )
  ) {
    return <div>Invalid DNS type</div>;
  }

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
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/dns/${type}`}>
                    {type.toUpperCase()}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => refetch())}
              className="flex gap-4 items-center"
            >
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a domain name to lookup.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isFetching}>
                {isFetching && (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                )}
                {isFetching ? "Loading" : "Submit"}
              </Button>
            </form>
          </Form>
          <div className="flex flex-col gap-2">
            {!data
              ? dohServers.map((server) => (
                  <Card key={server.name} className="rounded-md shadow-none">
                    <CardHeader className="p-4 pb-0">
                      <CardTitle>{server.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <CardDescription>
                        {isFetching ? "Loading..." : "No data"}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))
              : data.map((server) => (
                  <Card key={server.name} className="rounded-md shadow-none">
                    <CardHeader className="p-4 pb-0">
                      <CardTitle>{server.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 flex-col flex items-start">
                      <TooltipProvider>
                        {(
                          server.response.Answer ?? server.response.Authority
                        ).map((item: any) => (
                          <Tooltip key={item.data}>
                            <TooltipTrigger>
                              <CardDescription key={item.data}>
                                {item.data}
                              </CardDescription>
                            </TooltipTrigger>
                            <TooltipContent>
                              TTL: {item.TTL} (
                              {new Date(
                                Date.now() + item.TTL * 1000
                              ).toLocaleString()}
                              )
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </TooltipProvider>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
