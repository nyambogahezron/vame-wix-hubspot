export declare class SyncService {
    static syncContact(integrationId: number, source: "wix" | "hubspot", contactData: any): Promise<void>;
    private static syncToHubSpot;
    private static syncToWix;
    private static applyTransform;
    private static updateLedger;
}
//# sourceMappingURL=SyncService.d.ts.map