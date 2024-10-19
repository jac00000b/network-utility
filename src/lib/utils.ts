import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const dnsTypes = [
  "a",
  "aaaa",
  "cname",
  "mx",
  "txt",
  "ns",
  "soa",
  "ptr",
  "srv",
] as const;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dohServers = [
  {
    name: "Google",
    url: "https://dns.google/resolve",
  },
  {
    name: "Cloudflare",
    url: "https://cloudflare-dns.com/dns-query",
  },
];
