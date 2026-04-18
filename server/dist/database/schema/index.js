import { pgTable, serial, text, timestamp, integer, varchar } from "drizzle-orm/pg-core";
export const integrations = pgTable("integrations", {
    id: serial("id").primaryKey(),
    wixSiteId: varchar("wix_site_id", { length: 255 }).notNull().unique(),
    hubspotPortalId: varchar("hubspot_portal_id", { length: 255 }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    tokenExpiresAt: timestamp("token_expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const mappings = pgTable("mappings", {
    id: serial("id").primaryKey(),
    integrationId: integer("integration_id")
        .references(() => integrations.id)
        .notNull(),
    wixField: varchar("wix_field", { length: 255 }).notNull(),
    hubspotProperty: varchar("hubspot_property", { length: 255 }).notNull(),
    direction: varchar("direction", { length: 20 }).notNull().default("both"), // wix_to_hs, hs_to_wix, both
    transform: varchar("transform", { length: 50 }), // trim, lowercase, etc.
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const syncLedger = pgTable("sync_ledger", {
    id: serial("id").primaryKey(),
    integrationId: integer("integration_id")
        .references(() => integrations.id)
        .notNull(),
    wixContactId: varchar("wix_contact_id", { length: 255 }).notNull(),
    hubspotContactId: varchar("hubspot_contact_id", { length: 255 }).notNull(),
    lastSyncedAt: timestamp("last_synced_at").defaultNow().notNull(),
    lastSource: varchar("last_source", { length: 20 }).notNull(), // wix, hubspot
});
//# sourceMappingURL=index.js.map