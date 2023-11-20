export type Rule<T extends boolean = false> = {
  actions: any[];
  conditions: any[];
  priority?: number;
  tags?: string[];
} & (T extends true ? { id: string } : { id?: string });

export type UrlFilter = {
  hostContains?: string;
  hostEquals?: string;
  hostPrefix?: string;
  hostSuffix?: string;
  originAndPathMatches?: string;
  pathContains?: string;
  pathEquals?: string;
  pathPrefix?: string;
  pathSuffix?: string;
  ports?: (number | number[])[];
  queryContains?: string;
  queryEquals?: string;
  queryPrefix?: string;
  querySuffix?: string;
  schemes?: string[];
  urlContains?: string;
  urlEquals?: string;
  urlMatches?: string;
  urlPrefix?: string;
  urlSuffix?: string;
};
