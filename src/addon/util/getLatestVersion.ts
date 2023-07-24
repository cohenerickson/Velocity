import bareClient from "~/util/bareClient";

// https://github.com/PlasmoHQ/mozilla-addons-api/blob/91fff1109ecc365e743d8ec98f9b76709f6aac61/src/index.ts#L19C1-L19C1
type VersionResponse = {
  id: number;
  approval_notes: string;
  channel: "listed" | "unlisted";
  compatibility: object;
  edit_url: string;
  file: {
    id: number;
    created: string;
    hash: string;
    is_mozilla_signed_extension: boolean;
    size: number;
    status: "public" | "disabled" | "nominated";
    url: string;
    permissions: string[];
    optional_permissions: string[];
    host_permissions: string[];
  };
  is_disabled: boolean;
  is_strict_compatibility_enabled: boolean;
  license: object | null;
  release_notes: string | null;
  reviewed: string;
  source: string | null;
  version: string;
};

export default async function getLatestversion(
  id: string
): Promise<VersionResponse> {
  const request = await bareClient.fetch(
    `https://addons.mozilla.org/api/v5/addons/addon/${id}/versions/`
  );

  const json = await request.json();

  return json.results.find((x: VersionResponse) => x.channel === "listed");
}
