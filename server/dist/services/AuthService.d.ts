export declare class AuthService {
    static getHubSpotAuthUrl(state?: string): string;
    static handleHubSpotCallback(code: string, wixSiteId: string): Promise<{
        hubspotPortalId: string;
    }>;
    static getValidToken(integrationId: number): Promise<string | null>;
}
//# sourceMappingURL=AuthService.d.ts.map