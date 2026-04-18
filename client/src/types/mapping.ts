export type MappingDirection = "wix_to_hs" | "hs_to_wix" | "both";

export type FieldMapping = {
  id: number;
  integrationId: number;
  wixField: string;
  hubspotProperty: string;
  direction: MappingDirection;
  transform: string | null;
  createdAt: string | Date;
};
