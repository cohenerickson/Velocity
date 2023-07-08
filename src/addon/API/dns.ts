const Cache = new Map<string, DNSRecord>();
const IPV6_REGEX =
  /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/;
const IPV4_REGEX = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;

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

type DNSRecord = {
  addresses: string[];
  canonicalName?: string;
  isTRR: boolean;
};

type Answer = {
  name: string;
  type: number;
  TTL: number;
  data: string;
};

export async function resolve(
  hostname: string,
  flags: Flag[] = []
): Promise<DNSRecord> {
  const cached: DNSRecord = Cache.get(hostname) ?? {
    addresses: [],
    isTRR: true
  };

  let updateCname = false;
  let updateAddresses = false;

  if (flags.includes("bypass_cache") || !cached.addresses.length) {
    updateCname = true;
    updateAddresses = true;
  }

  if (flags.includes("canonical_name") && !cached?.canonicalName) {
    updateCname = true;
  }

  if (flags.includes("offline")) {
    updateCname = false;
    updateAddresses = false;
  }

  if (updateAddresses || updateCname) {
    const response = await fetch(`https://1.1.1.1/dns-query?name=${hostname}`, {
      headers: {
        accept: "application/dns-json"
      }
    });

    const data = await response.json();

    if (updateAddresses) {
      cached.addresses = (
        data.Answer.filter((x: Answer) => x.type === 28 || x.type === 1) ?? []
      ).map((x: Answer) => x.data);
    }

    if (updateCname) {
      cached.canonicalName = (
        data.Answer.filter((x: Answer) => x.type === 5)[0] ?? {
          data: undefined
        }
      ).data;
    }

    Cache.set(hostname, cached);
  }

  if (flags.includes("disable_ipv4")) {
    cached.addresses = cached.addresses.filter(IPV6_REGEX.test);
  }

  if (flags.includes("disable_ipv6")) {
    cached.addresses = cached.addresses.filter(IPV4_REGEX.test);
  }

  if (!flags.includes("canonical_name")) {
    cached.canonicalName = undefined;
  }

  return cached;
}
