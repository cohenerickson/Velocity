// TODO: Implement virtual cache
import { v4 } from "uuid";

type Flag =
  | "allow_name_collisions"
  | "bypass_cache"
  | "canonical_name"
  | "disable_ipv4"
  | "disable_ipv6"
  | "disable_trr"
  | "offline"
  | "priority_low"
  | "priority_medium"
  | "speculate";

class DNSRecord {
  addresses: string[];
  canonicalName: string;
  isTRR: boolean = true;

  constructor(addresses: string[], canonicalName: string = "") {
    this.addresses = addresses;
    this.canonicalName = canonicalName;
  }
}

type GDNSAnswer = {
  name: string;
  type: number;
  TTL: number;
  data: string;
};

export async function resolve(hostname: string, flags: Flag[]): Promise<DNSRecord> {
  let cname = "";
  let url = `https://dns.google/resolve?name=${hostname}&type=A`;

  if (flags.includes("bypass_cache")) {
    url += `&cache=${v4()}`;
  }

  if (flags.includes("canonical_name")) {
    const response = await _$bareClient.fetch(url);
    const data = await response.json();
    if (data.Anser) {
      cname = (
        data.Answer.filter((x: GDNSAnswer) => x.type === 5)[0] ?? { data: "" }
      ).data;
    }
  }

  const response = await _$bareClient.fetch(url);
  const data = await response.json();
  let addresses = [];

  if (data.Answer) {
    addresses =
      data.Answer.filter((x: GDNSAnswer) => x.type === 28 || x.type === 1) ??
      [];

    if (flags.includes("disable_ipv4")) {
      addresses = addresses.filter((x: GDNSAnswer) => x.type === 28);
    }

    if (flags.includes("disable_ipv6")) {
      addresses = addresses.filter((x: GDNSAnswer) => x.type === 1);
    }
  }

  return new DNSRecord(
    addresses.map((x: GDNSAnswer) => x.data),
    cname
  );
}
